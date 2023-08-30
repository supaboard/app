import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { Client } from "pg"
import { getConnectionDetails } from "@/lib/database"
import { buildComplexQuery } from "@/lib/postgres/querybuilder"


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

		const client = new Client({
			host: connectionDetails.host,
			port: parseInt(connectionDetails.port),
			user: connectionDetails.user,
			password: connectionDetails.password,
			database: connectionDetails.database,
		})
		await client.connect()

		if (data.filters.query) {
			const res = await client.query(data.filters.query)
			result = res.rows
			client.end()
			return NextResponse.json(result || [])
		}

		const query = await buildComplexQuery(data)
		const res = await client.query(query)
		result = res.rows
		client.end()

		return NextResponse.json(result || [])
	} catch (error) {
		console.log(error)
		return NextResponse.json([])
	}
}
