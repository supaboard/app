import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/stripe"
import { headers } from "next/headers"
import { upsertProductRecord, upsertPriceRecord, manageSubscriptionStatusChange } from "@/lib/stripe/supabase-admin"

const relevantEvents = new Set([
	"product.created",
	"product.updated",
	"price.created",
	"price.updated",
	"checkout.session.completed",
	"customer.subscription.created",
	"customer.subscription.updated",
	"customer.subscription.deleted"
])

export async function POST(req) {
	const rawBody = await req.text()

	const headres = headers()
	const signature = headres.get("stripe-signature")

	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET
	let event

	try {
		if (!signature || !webhookSecret) return
		event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
	} catch (err) {
		console.log(`❌ Error message: ${err.message}`)
		return new NextResponse.json({ error: err.message }, { status: 400 })
	}

	if (relevantEvents.has(event.type)) {
		try {
			switch (event.type) {
				case "product.created":
				case "product.updated":
					await upsertProductRecord(event.data.object)
					break
				case "price.created":
				case "price.updated":
					await upsertPriceRecord(event.data.object)
					break
				case "customer.subscription.created":
				case "customer.subscription.updated":
				case "customer.subscription.deleted":
					const subscription = event.data.object
					await manageSubscriptionStatusChange(
						subscription.id,
						subscription.customer,
						event.type === "customer.subscription.created"
					)
					break
				case "checkout.session.completed":
					const checkoutSession = event.data
						.object
					if (checkoutSession.mode === "subscription") {
						const subscriptionId = checkoutSession.subscription
						await manageSubscriptionStatusChange(
							subscriptionId,
							checkoutSession.customer,
							true
						)
					}
					break
				default:
					throw new Error("Unhandled relevant event!")
			}
		} catch (error) {
			console.log(error)
			return new NextResponse.json({ error: "Webhook handler failed. View logs" }, { status: 400 })
		}
	}

	return NextResponse.json({ received: true })
}
