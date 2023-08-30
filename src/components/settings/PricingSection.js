import { useState } from "react"
import { getStripe } from "@/lib/stripe/stripe-client"
import { CheckCircleIcon } from "@heroicons/react/20/solid"
import { RadioGroup } from "@headlessui/react"
import { classNames } from "@/util"
import { tiers } from "@/config/pricing"

const frequencies = [
	{ value: "monthly", label: "Monthly", priceSuffix: "/month" },
	{ value: "annually", label: "Annually", priceSuffix: "/year" }
]


const PricingSection = () => {
	const [frequency, setFrequency] = useState(frequencies[0])

	const handleCheckout = async (tier) => {
		try {
			let priceId = frequency.value === "monthly" ? tier.stripe_id_monthly : tier.stripe_id_anually

			const res = await fetch("/api/payments-api/create-checkout-session", {
				method: "POST",
				body: JSON.stringify({
					price: {
						id: priceId,
						name: tier.name,
					}
				})
			})

			if (!res.ok) {
				// Couldn't init Stripe session
				throw new Error(res.data.error.message)
			}

			const { sessionId } = await res.json()
			const stripe = await getStripe()
			stripe?.redirectToCheckout({ sessionId })
		} catch (error) {
			return alert(error?.message)
		} finally {
			// setPriceIdLoading(undefined)
		}
	}

	return (
		<div>
			<div className="flex justify-center">
				<RadioGroup
					value={frequency}
					onChange={setFrequency}
					className="grid grid-cols-2 p-1 text-xs font-semibold leading-5 text-center bg-white rounded-full gap-x-1 ring-1 ring-inset ring-gray-200"
				>
					<RadioGroup.Label className="sr-only">
						Payment frequency
					</RadioGroup.Label>
					{frequencies.map((option) => (
						<RadioGroup.Option
							key={option.value}
							value={option}
							className={({ checked }) =>
								classNames(
									checked ? "bg-black text-white" : "text-gray-500",
									"cursor-pointer rounded-full py-1 px-2.5"
								)
							}
						>
							<span>{option.label}</span>
						</RadioGroup.Option>
					))}
				</RadioGroup>
			</div>

			<div className="flow-root px-4 mt-8 bg-white border border-gray-200 rounded-md shadow">
				<div className="grid grid-cols-1 py-4 divide-y divide-gray-200 isolate md:py-0 xl:grid-cols-3 lg:divide-y-0 lg:divide-x xl:-mx-4">
					{tiers.slice(1).map((tier) => (
						<div key={tier.name} className="p-8">
							<h3 className="text-base font-semibold leading-7 text-gray-900">
								{tier.name}
							</h3>
							<>
								<p className="flex items-baseline mt-6 gap-x-1">
									{frequency.value === "monthly" && (
										<>
											<span className="text-4xl font-bold tracking-tight text-gray-900">
												${tier.price.monthly}
											</span>
											<span className="text-sm font-semibold leading-6 text-gray-600">
												/month
											</span>
										</>
									)}
									{frequency.value === "annually" && (
										<>
											<span className="text-4xl font-bold tracking-tight text-gray-900">
												${tier.price.annually}
											</span>
											<span className="text-sm font-semibold leading-6 text-gray-600">
												/year
											</span>
										</>
									)}
								</p>
								{frequency.value === "monthly" && (
									<p className="mt-3 text-sm leading-6 text-gray-500">
										${tier.price.annually} per year if paid annually
									</p>
								)}
								{frequency.value === "annually" && (
									<p className="mt-3 text-sm leading-6 text-gray-500">
										${tier.price.monthly} per month if paid monthly
									</p>
								)}
							</>
							<button
								onClick={() => handleCheckout(tier)}
								aria-describedby={tier.id}
								className="w-full my-4 btn-default place-content-center"
							>
								Buy plan
							</button>
							<p className="mt-4 text-sm font-semibold leading-6 text-gray-900 lg:h-16">
								{tier.description}
							</p>
							<ul
								role="list"
								className="space-y-3 text-sm leading-6 text-gray-600"
							>
								{tier.features.map((feature) => (
									<li key={feature} className="flex gap-x-3">
										<CheckCircleIcon
											className="flex-none w-5 h-6 text-blue-500"
											aria-hidden="true"
										/>
										{feature}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			<div className="px-4 mt-8 bg-white border-2 border-highlight rounded-md p-4 grid grid-cols-1 md:grid-cols-3">
				<div className="md:col-span-2 p-6">
					<b>You&apos;re currently on the free plan.</b>
					<p className="text-gray-400 max-w-md">
						You can see the features of the free plan below. If you&apos;d like to upgrade to a paid plan, you can do so below.
					</p>
				</div>
				<div>
					<ul
						role="list"
						className="space-y-3 text-sm leading-6 text-gray-600"
					>
						{tiers[0].features.map((feature) => (
							<li key={feature} className="flex gap-x-3">
								<CheckCircleIcon
									className="flex-none w-5 h-6 text-blue-500"
									aria-hidden="true"
								/>
								{feature}
							</li>
						))}
					</ul>
				</div>
			</div>

		</div>
	)
}

export default PricingSection
