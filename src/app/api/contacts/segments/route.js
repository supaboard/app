import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { Client } from "pg"
import { checkUserAllowed } from "@/lib/auth"
import { getConnectionDetails } from "@/lib/database"


export async function GET(req) {
	const cookieStore = cookies()
	const account_id = cookieStore.get("account_id").value

	const supabase = createRouteHandlerClient({ cookies }, {
		options: {
			db: { schema: "supaboard" }
		}
	})

	const { data: { session } } = await supabase.auth.getSession()
	if (!session) throw new Error("Not authenticated")

	const accountUser = await checkUserAllowed(supabase, session, account_id)

	let query = supabase.from("segments").select()

	if (process.env.IS_PLATFORM) {
		query = query.eq("account_id", account_id)
	}

	const { data: segments, error } = await query

	if (error) {
		console.log(error)
		throw new Error("Internal Server Error")
	}

	if (!segments || segments.length === 0) {
		return NextResponse.json(null)
	}

	return NextResponse.json(segments)
}
