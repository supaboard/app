"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"


export const createPanel = async (formData) => {
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

    const panel_name = formData.get("panel_name")

    try {
        const { data, error } = await supabase
            .from("panels")
            .insert([
                {
                    name: panel_name,
					account_id: account_id
                },
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

