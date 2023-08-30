"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import PricingSection from "@/components/settings/PricingSection"
import SubscriptionSettings from "@/components/settings/SubscriptionSettings"
import Loading from "@/components/Loading"


export default function Billing() {
	const [user, setUser] = useState(null)
	const [activeSubscription, setActiveSubscription] = useState(null)
	const [loading, setLoading] = useState(true)
	const [activeAccount, setActiveAccount] = useState(null)
	const supabase = createClientComponentClient({
		options: {
			db: { schema: "supaboard" }
		}
	})

	useEffect(() => {
		const getAccounts = async () => {
			setActiveAccount(document.cookie.split("; ").find(row => row.startsWith("account_id")).split("=")[1])
			const { data: { session } } = await supabase.auth.getSession()
			setUser(session.user)
		}

		getAccounts()
	}, [])


	useEffect(() => {
		if (!activeAccount) return

		const getAccountBillingStatus = async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payments-api/status`)
			const data = await res.json()
			setActiveSubscription(data.subscription)
			setLoading(false)
		}

		getAccountBillingStatus()
	}, [activeAccount])

	return (

		<div>
			{loading && <Loading />}
			{!loading && (
				<>

					{!activeSubscription && <PricingSection />}
					{activeSubscription && (
						<SubscriptionSettings activeSubscription={activeSubscription} />
					)}
				</>
			)}
		</div>
	)
}
