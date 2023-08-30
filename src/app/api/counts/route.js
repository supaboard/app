import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { checkUserAllowed } from "@/lib/auth"


export async function GET(req) {
	const account_id = cookies().get("account_id")?.value
    const supabase = createRouteHandlerClient({ cookies }, {
        options: {
            db: { schema: "supaboard" }
        }
	})

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    let dbQuery = supabase.from("databases").select("*", { count: "exact"})
    let dashboardQuery = supabase.from("dashboards").select("*", { count: "exact"})
    let segmentQuery = supabase.from("segments").select("*", { count: "exact"})

    if (process.env.IS_PLATFORM) {
        dbQuery = dbQuery.eq("account_id", account_id)
        dashboardQuery = dashboardQuery.eq("account_id", account_id)
        segmentQuery = segmentQuery.eq("account_id", account_id)
    }

    const { data: databases, error: dbError } = await dbQuery
    const { data: dashboards, error: dahbordError } = await dashboardQuery
	const { data: segments, error: segmentError } = await segmentQuery

	if (dbError || dahbordError || segmentError) {
		console.log(dbError, dahbordError, segmentError)
		throw new Error("Failed to fetch data")
	}

	return NextResponse.json({
		databases: databases?.length || 0,
		dashboards: dashboards?.length || 0,
		segments: segments?.length || 0,
	})
}
