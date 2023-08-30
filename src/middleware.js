import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import { getUserAccounts } from "@/lib/auth"
import { applySetCookie } from "@/util"

export async function middleware(req) {
	const res = NextResponse.next()
	const supabase = createMiddlewareClient({ req, res })
	await supabase.auth.getSession()

	const { data: { user } } = await supabase.auth.getUser()

	// if user is not signed in redirect the user to /
	if (!user) {
		return NextResponse.redirect(new URL("/login", req.url))
	}

	// if user is signed in and the account_id cookie is not set, set the account_id cookie to the first account
	if (!req.cookies.get("account_id")) {
		const supabaseSupaboard = createMiddlewareClient({ req, res }, {
			options: {
				db: { schema: "supaboard" }
			}
		})
		let accounts = await getUserAccounts(supabaseSupaboard, user.id)
		if (accounts.length) {
			const response = NextResponse.next()
			response.cookies.set("account_id", accounts[0].account_id)
			applySetCookie(req, response)
			return response
		}
	} else {
		const response = NextResponse.next()
		response.cookies.set("account_id", req.cookies.get("account_id").value)
		applySetCookie(req, response)
		return response
	}

	return res
}

export const config = {
	matcher: [
		"/",
		"/overview",
		"/dashboards",
		"/databases",
		"/segments",
		"/settings/:path*",
	]
}
