import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { getConnectionDetails } from "@/lib/database"
import { fetchPostgresData } from "@/lib/adapters/postgres/querybuilder"
import { fetchMySQLData } from "@/lib/adapters/mysql/querybuilder"


export async function POST(req) {
	try {
		const data = await req.json()
		const cookieStore = cookies()
		const account_id = cookieStore.get("account_id").value

		const supabase = createRouteHandlerClient({ cookies }, {
			options: {
				db: { schema: "supaboard" }
			}
		})

		const connectionDetails = await getConnectionDetails(supabase, account_id, data.database)
		let result

		if (connectionDetails.type == "postgres" || connectionDetails.type == "supabase") {
			result = await fetchPostgresData(data, connectionDetails)
		}

		if (connectionDetails.type == "mysql" || connectionDetails.type == "planetscale") {
			result = await fetchMySQLData(data, connectionDetails)
		}

		return NextResponse.json(result || [])
	} catch (error) {
		console.log(error)
		return NextResponse.json([])
	}
}
