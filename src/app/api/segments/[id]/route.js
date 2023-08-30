import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { Client } from "pg"


import { decrypt } from "@/lib/crypto"
import { checkUserAllowed } from "@/lib/auth"
import { operatorMap } from "@/lib/operators"
import { buildQuery } from "@/lib/postgres/querybuilder"

export async function GET(req, { params }) {
	const id = params.id
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

	// Get segment
	let query = supabase.from("segments").select().eq("uuid", id)
	if (process.env.IS_PLATFORM) { query = query.eq("account_id", account_id) }
	query = query.single()
	const { data: segment, error } = await query

	if (error) {
		console.log(error)
		throw Error(error)
	}

	// Get database
	let databaseQuery = supabase.from("databases").select().eq("uuid", segment.database)
	if (process.env.IS_PLATFORM) { databaseQuery = databaseQuery.eq("account_id", account_id) }
	query = databaseQuery.single()
	const { data: database, error: dbError } = await databaseQuery

	if (error || dbError) {
		console.log(error)
		console.log(dbError)
		throw Error(error || dbError)
	}


	const connectionDetails = JSON.parse(decrypt(database.connection))
	const client = new Client({
		host: connectionDetails.host,
		port: parseInt(connectionDetails.port),
		user: connectionDetails.user,
		password: connectionDetails.password,
		database: connectionDetails.database,
	})
	await client.connect()

	let segmentQuery
	if (segment.config.filterType == "simple") {
		segmentQuery = await buildQuery(segment.config)
	} else {
		segmentQuery = segment.config.filters.query
	}


	const res = await client.query(segmentQuery)
	client.end()

	let attributes = res.fields.map((field) => {
		return {
			name: field.name,
			identifier: field.name,
			type: field.dataTypeID
		}
	})

	return NextResponse.json({
		segment,
		attributes,
		contacts: res.rows
	})
}
