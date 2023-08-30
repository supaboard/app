import { useState, useEffect } from "react"
import { classNames } from "../util"

const SubscriptionSettings = ({ activeSubscription }) => {
	const [loading, setLoading] = useState(false)
	const [plans, setPlans] = useState([])

	const redirectToCustomerPortal = async () => {
		setLoading(true)
		try {
			const res = await fetch("/api/payments-api/create-portal-link")
			const data = await res.json()
			const { url } = data
			window.location.assign(url)
		} catch (error) {
			if (error) return alert((error).message)
		}
		setLoading(false)
	}

	useEffect(() => {
		const getAvailablePlans = async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payments-api/plans`)
			const data = await res.json()
			setPlans(data?.plans?.filter(plan => plan.billing_products.active))
			setLoading(false)
		}

		getAvailablePlans()
	}, [])


	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-white p-4 rounded-md border border-gray-200">
					<h2 className="text-xl font-black">Your plan</h2>
					<p className="mt-4 text-gray-600">
						You&apos;re currently subscribed to the <span className="font-bold text-black bg-orange-200 px-2 py-0.25 rounded">{activeSubscription?.product.name}</span> plan.
						<br />
						To change or cancel your subscription, please use the Stripe customer portal by clicking the button below.
					</p>
				</div>

				<div className="bg-white p-4 rounded-md border border-gray-200">
					<h2 className="text-xl font-black">Available plans</h2>
					<div className="border border-gray-300 rounded mt-2">
						<table className="min-w-full divide-y divide-gray-300">
							<thead className="bg-gray-200">
								<tr className="bg-gray-100">
									<th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Plan</th>
									<th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Price</th>
								</tr>
							</thead>
							<tbody className="bg-white">
								{plans && plans.map((plan, index) => {
									return (
										<tr key={plan.id}>
											<td
												className={classNames(
													index === 0 ? "" : "border-t border-gray-200",
													"relative py-4 pl-6 pr-3 text-sm"
												)}
											>
												{plan.billing_products.name}
											</td>
											<td
												className={classNames(
													index === 0 ? "" : "border-t border-gray-200",
													"relative py-4 pl-6 pr-3 text-sm"
												)}
											>
												${plan.unit_amount / 100} {plan.currency.toUpperCase()} / {plan.interval}
											</td>
										</tr>
									)
								})}

							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div className="mt-4 bg-white p-4 rounded-md border border-gray-200">
				<div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
					<b className="pb-4 sm:pb-0">
						Manage your subscription on Stripe.
					</b>
					<button
						className="btn-default"
						disabled={!activeSubscription}
						onClick={redirectToCustomerPortal}
					>
						Open customer portal
					</button>
				</div>
			</div>
		</div>
	)
}

export default SubscriptionSettings

