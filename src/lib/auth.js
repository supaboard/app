import { permissions } from "@/config/permissions"

/**
 * Get the user's accounts (teams) and their roles
 */
export const getUserAccounts = async (supabase, user_id) => {
	const { data: userAccounts, error } = await supabase
		.from("account_user")
		.select("account_id, account_role, accounts(*)")
		.eq("user_id", user_id)

	if (error) {
		console.log(error)
		throw new Error("Internal Server Error")
	}

	return userAccounts
}


/**
 * Check if the user is allowed to access the resource based on whether they belong to the account (team)
 * This defaults to true for self-hosted instances
 */
export const checkUserAllowed = async (supabase, session, account_id) => {
	if (!process.env.IS_PLATFORM) {
		return true
	}

	const { data: accountUser, error } = await supabase
		.from("accounts")
		.select("team_name, id, personal_account, primary_owner_user_id, account_user(*)")
		.eq("account_user.user_id", session.user.id)
		.eq("account_user.account_id", account_id)

	if (error) {
		throw new Error("Internal Server Error")
	}

	if (!accountUser.length) {
		throw new Error("Unauthorized. You may not be allowed to access this resource.")
	}

	return accountUser[0]
}



export const can = async (permission) => {
	if (!process.env.NEXT_PUBLIC_IS_PLATFORM || process.env.NEXT_PUBLIC_ENV === "dev") {
		return true
	}

	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payments-api/status`)
		const data = await res.json()
		let plan = null

		if (data?.subscription) {
			plan = data.subscription.product.name
		} else {
			plan = "Free"
		}

		const plan_limits = permissions[plan]
		const limit = plan_limits[permission]?.limit

		const countsQuery = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/counts`)
		const counts = await countsQuery.json()

		if (permission === "create:segment") {
			return counts.segments < limit
		}

		if (permission === "create:dashboard") {
			return counts.dashboards < limit
		}

		if (permission === "create:datasource") {
			return counts.databases < limit
		}

		if (permission === "invite:member") {
			return plan_limits[permission]
		}

		return false
	} catch (err) {
		console.log(err)
		return false
	}
}
