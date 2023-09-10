import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { Client } from "pg"
import mysql from "mysql2/promise"


import { decrypt } from "@/lib/crypto"
import { checkUserAllowed } from "@/lib/auth"

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
	let query = supabase
		.from("databases")
		.select()
		.eq("uuid", id)

	if (process.env.IS_PLATFORM) {
		query = query.eq("account_id", account_id)
	}

	query = query.single()
	const { data: database, error } = await query

	if (error) {
		console.log(error)
		throw new Error("Failed to fetch database")
	}

	const connectionDetails = JSON.parse(decrypt(database.connection))
	const connectionString = `postgresql://${connectionDetails.user}:${connectionDetails.password}@${connectionDetails.host}:${connectionDetails.port}/${connectionDetails.database}`

	let tables = {}

	if (database.type == "postgres" || database.type == "supabase") {
		const client = new Client({
			host: connectionDetails.host,
			port: parseInt(connectionDetails.port),
			user: connectionDetails.user,
			password: connectionDetails.password,
			database: connectionDetails.database,
		})
		await client.connect()

		const res = await client.query("SELECT table_schema, table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, column_name")
		client.end()



		res.rows.forEach((row) => {
			if (!tables[row.table_name]) {
				tables[row.table_name] = {
					name: row.table_name,
					columns: []
				}
			}
			tables[row.table_name].columns.push({
				name: row.column_name,
				type: row.data_type
			})
		})

		tables = Object.keys(tables).map((key) => {
			return tables[key]
		})
	}

	if (database.type == "mysql" || database.type == "planetscale") {
		const connection = await mysql.createConnection({
			host: connectionDetails.host,
			port: parseInt(connectionDetails.port),
			user: connectionDetails.user,
			password: connectionDetails.password,
			database: connectionDetails.database,
			ssl: {
				rejectUnauthorized: true,
			}
		})

		const [rows, fields] = await connection.execute("SELECT table_schema, table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = ? ORDER BY table_name, column_name", [connectionDetails.database]);
		connection.end()

		rows.forEach((row) => {
			if (!tables[row.TABLE_NAME]) {
				tables[row.TABLE_NAME] = {
					name: row.TABLE_NAME,
					columns: []
				}
			}
			tables[row.TABLE_NAME].columns.push({
				name: row.COLUMN_NAME,
				type: row.DATA_TYPE
			})
		})

		tables = Object.keys(tables).map((key) => {
			return tables[key]
		})
	}

	return NextResponse.json(tables || [])
}
