"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"


export const createSegment = async (segmentData) => {
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

	segmentData.account_id = account_id

    try {
        const { data, error } = await supabase
            .from("segments")
			.insert([{
				name: segmentData.name,
				config: segmentData.config,
				account_id: segmentData.account_id,
				database: segmentData.database,
            }])
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


export const updateSegment = async (formData) => {
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
		const { data, error } = await supabase
			.from("segments")
			.update([
				{
					name: formData.name,
					config: formData.config,
				}
			])
			.eq("uuid", formData.uuid)
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


export const deleteSegment = async (segment) => {
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
            .from("segments")
            .delete()
            .eq("id", segment.id)
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

export const deleteContacts = async (segment) => {
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
		const { data, error } = await supabase
            .from("contacts")
            .delete()
            .eq("account_id", account_id)
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
