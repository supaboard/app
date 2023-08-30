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

	// Step 1: Get the database connection details and where to find the contacts
	let query = supabase.from("contacts").select()

	if (process.env.IS_PLATFORM) {
		query = query.eq("account_id", account_id)
	}

	const { data: contacts, error } = await query

	if (error) {
		console.log(error)
		throw new Error("Internal Server Error")
	}

	if (!contacts || contacts.length === 0) {
		return NextResponse.json([])
	}


	// Step 2: Fetch the actual contacts from the external database
	const columns = contacts[0].attributes.map((attribute) => {
		return attribute.name
	})
	let result = []
	const connectionDetails = await getConnectionDetails(supabase, account_id, contacts[0].database)
	const client = new Client({
		host: connectionDetails.host,
		port: parseInt(connectionDetails.port),
		user: connectionDetails.user,
		password: connectionDetails.password,
		database: connectionDetails.database,
	})
	await client.connect()

	const externalQuery = await client.query(`SELECT ${columns} FROM ${contacts[0].table_name}`)
	result = externalQuery.rows
	client.end()

	let returnValue = {
		attributes: null,
		database: null,
		contacts: []
	}

	if (contacts.length > 0) {
		returnValue = {
			attributes: contacts[0].attributes,
			database: contacts[0].database,
			contacts: result
		}
	}

	return NextResponse.json(returnValue)
}
