import { createClient } from "@supabase/supabase-js"
import { stripe } from "./stripe"
import { toDateTime } from "@/util"

const supabaseAdmin = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL || "",
	process.env.SUPABASE_SERVICE_ROLE_KEY || "",
	{ db: { schema: "supaboard" } }
)


const upsertProductRecord = async (product) => {
	const productData = {
		id: product.id,
		active: product.active,
		name: product.name,
		description: product.description ?? undefined,
		image: product.images?.[0] ?? null,
		metadata: product.metadata
	};

	const { error } = await supabaseAdmin.from("billing_products").upsert([productData]);
	if (error) throw error;
};


const upsertPriceRecord = async (price) => {
	const priceData = {
		id: price.id,
		billing_product_id: typeof price.product === "string" ? price.product : "",
		active: price.active,
		currency: price.currency,
		description: price.nickname ?? undefined,
		type: price.type,
		unit_amount: price.unit_amount ?? undefined,
		interval: price.recurring?.interval,
		interval_count: price.recurring?.interval_count,
		trial_period_days: price.recurring?.trial_period_days,
		metadata: price.metadata
	};

	const { error } = await supabaseAdmin.from("billing_prices").upsert([priceData]);
	if (error) throw error;
};


const createOrRetrieveCustomer = async ({ email, uuid }) => {
	const { data, error } = await supabaseAdmin
		.from("billing_customers")
		.select("stripe_customer_id")
		.eq("account_id", uuid)
		.single();
	if (error || !data?.stripe_customer_id) {
		// No customer record found, let's create one.
		const customerData =
		{
			metadata: {
				supabaseUUID: uuid
			}
		};
		if (email) customerData.email = email;
		const customer = await stripe.customers.create(customerData);
		// Now insert the customer ID into our Supabase mapping table.
		const { error: supabaseError } = await supabaseAdmin
			.from("billing_customers")
			.insert([{ account_id: uuid, stripe_customer_id: customer.id }]);
		if (supabaseError) throw supabaseError;
		return customer.account_id;
	}
	return data.stripe_customer_id;
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (uuid, payment_method) => {
	const customer = payment_method.customer
	const { name, phone, address } = payment_method.billing_details;
	if (!name || !phone || !address) return;
	//@ts-ignore
	await stripe.customers.update(customer, { name, phone, address });
	const { error } = await supabaseAdmin
		.from("billing_users")
		.update({
			billing_address: { ...address },
			payment_method: { ...payment_method[payment_method.type] }
		})
		.eq("id", uuid);
	if (error) throw error;
};

const manageSubscriptionStatusChange = async (subscriptionId, customerId, createAction = false) => {
	// Get customer's UUID from mapping table.
	const { data: customerData, error: noCustomerError } = await supabaseAdmin
		.from("billing_customers")
		.select("account_id")
		.eq("stripe_customer_id", customerId)
		.single();
	if (noCustomerError) throw noCustomerError;

	const { account_id: uuid } = customerData;

	const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
		expand: ["default_payment_method"]
	});
	// Upsert the latest status of the subscription object.
	const subscriptionData =
	{
		id: subscription.id,
		account_id: uuid,
		metadata: subscription.metadata,
		status: subscription.status,
		price_id: subscription.items.data[0].price.id,
		// @ts-ignore
		quantity: subscription.quantity,
		cancel_at_period_end: subscription.cancel_at_period_end,
		cancel_at: subscription.cancel_at
			? toDateTime(subscription.cancel_at).toISOString()
			: null,
		canceled_at: subscription.canceled_at
			? toDateTime(subscription.canceled_at).toISOString()
			: null,
		current_period_start: toDateTime(
			subscription.current_period_start
		).toISOString(),
		current_period_end: toDateTime(
			subscription.current_period_end
		).toISOString(),
		created: toDateTime(subscription.created).toISOString(),
		ended_at: subscription.ended_at
			? toDateTime(subscription.ended_at).toISOString()
			: null,
		trial_start: subscription.trial_start
			? toDateTime(subscription.trial_start).toISOString()
			: null,
		trial_end: subscription.trial_end
			? toDateTime(subscription.trial_end).toISOString()
			: null
	};

	const { error } = await supabaseAdmin
		.from("billing_subscriptions")
		.upsert([subscriptionData]);
	if (error) throw error;

	if (createAction && subscription.default_payment_method && uuid)
		//@ts-ignore
		await copyBillingDetailsToCustomer(
			uuid,
			subscription.default_payment_method
		);
};

export {
	upsertProductRecord,
	upsertPriceRecord,
	createOrRetrieveCustomer,
	manageSubscriptionStatusChange
};
