import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { checkUserAllowed } from "@/lib/auth"

export async function GET(req, { params }) {
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

    let query = supabase
        .from("segments")
        .select()

    if (process.env.IS_PLATFORM) {
        query = query.eq("account_id", account_id)
    }

    query.order("created_at", { ascending: false })

	const { data: segments, error } = await query

	if (error) {
		console.log(error)
		throw Error(error)
	}

    return NextResponse.json(segments)
}
