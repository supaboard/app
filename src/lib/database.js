import { decrypt } from "./crypto"

export const getConnectionDetails = async (supabase, account_id, tabase_uuid) => {
	let query = supabase
		.from("databases")
		.select()
		.eq("uuid", tabase_uuid)

	if (process.env.IS_PLATFORM) {
		query = query.eq("account_id", account_id)
	}

	query = query.single()
	const { data: database, error } = await query

	if (error) {
		console.log(error)
		throw new Error("Internal Server Error")
	}

	let connectionDetails = JSON.parse(decrypt(database.connection))
	connectionDetails.type = database.type

	return connectionDetails
}
