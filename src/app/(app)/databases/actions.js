"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { encrypt } from "@/lib/crypto"


export const createDatabase = async (name, databaseType, connection) => {
	const cookieStore = cookies()
	const account_id = cookieStore.get("account_id").value
	const supabase = createServerActionClient({ cookies }, {
		options: {
			db: { schema: "supaboard" }
		}
	})
	const { data: { session } } = await supabase.auth.getSession()
	if (!session) {
		throw new Error("Not authenticated")
	}

	try {
		const encryptedConnection = encrypt(JSON.stringify(connection))
		const { data, error } = await supabase
			.from("databases")
			.insert([
				{
					name: name,
					type: databaseType,
					connection: encryptedConnection,
					account_id: account_id
				}
			])
			.select()
			.single()

		if (error) {
			console.log(error)
			throw Error(error)
		}

		return data
	} catch (error) {
		throw Error(error)
	}
}



export const updateDatabase = async (formData) => {
	const cookieStore = cookies()
	const account_id = cookieStore.get("account_id").value
	const supabase = createServerActionClient({ cookies }, {
		options: {
			db: { schema: "supaboard" }
		}
	})
	const { data: { session } } = await supabase.auth.getSession()
	if (!session) {
		throw new Error("Not authenticated")
	}

	const name = formData.get("name")
	const host = formData.get("host")
	const port = formData.get("port")
	const user = formData.get("user")
	const password = formData.get("password")
	const database = formData.get("database")

	let connection = {
		host: databaseDetails.host,
		port: databaseDetails.port,
		user: databaseDetails.user,
		password: databaseDetails.password,
		database: databaseDetails.database,
	}

	try {
		const encryptedConnection = encrypt(JSON.stringify(connection))
		const { data, error } = await supabase
			.from("databases")
			.insert([
				{
					name: name,
					type: databaseType,
					connection: encryptedConnection,
					account_id: account_id
				}
			])
			.select()
			.single()

		if (error) {
			console.log(error)
			throw Error(error)
		}

		return data
	} catch (error) {
		throw Error(error)
	}
}


export const deleteDatabase = async (database) => {
	const supabase = createServerActionClient({ cookies }, {
		options: {
			db: { schema: "supaboard" }
		}
	})
	const { data: { session } } = await supabase.auth.getSession()
	if (!session) {
		throw new Error("Not authenticated")
	}

	try {
		const { data, error } = await supabase
            .from("databases")
            .delete()
            .eq("id", database.id)
            .select()
            .single()

		if (error) {
			console.log(error)
			throw Error(error)
		}

		return data
	} catch (error) {
		throw Error(error)
	}
}
