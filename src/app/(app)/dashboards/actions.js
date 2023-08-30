"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"


export const createDashboard = async (formData) => {
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

    const dashboard_name = formData.get("dashboard_name")
    const timeframe = formData.get("timeframe")

    try {
        const { data, error } = await supabase
            .from("dashboards")
            .insert([
                {
                    name: dashboard_name,
                    config: {
                        timeframe,
					},
					is_public: false,
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


export const updateDashboard = async (dashboard) => {
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
            .from("dashboards")
            .update({
                name: dashboard.name,
                config: dashboard.config,
                is_public: dashboard.is_public || false
            })
            .eq("id", dashboard.id)
            .select()

        if (error) {
            console.log(error)
            throw Error(error)
        }

        return data
    } catch (error) {
        throw Error(error)
    }
}


export const deleteDahboard = async (dashboard) => {
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
            .from("dashboards")
            .delete()
            .eq("id", dashboard.id)
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


export const addChart = async (dashboard_uuid, dashboard_data) => {
    const supabase = createServerActionClient({ cookies }, {
        options: {
            db: { schema: "supaboard" }
        }
    })
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        throw new Error("Not authenticated")
    }

console.log(dashboard_data)
    try {
        const { data, error } = await supabase
            .from("dashboards")
            .update({
                config: dashboard_data
            })
            .eq("uuid", dashboard_uuid)
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
