"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { redirect } from "next/navigation"


export const createWorkspace = async (formData) => {
	const supabase = createServerActionClient({ cookies }, {
		options: {
			db: { schema: "supaboard" }
		}
	})
	const { data: { session } } = await supabase.auth.getSession()
	if (!session) {
		throw new Error("Not authenticated")
	}

	const teamName = formData.get("name")

	const { data, error } = await supabase
		.from("accounts")
		.insert({
			team_name: teamName
		})
		.select()

	if (error) {
		console.log(error)
		throw Error(error)
	}

	redirect("/settings/workspace")
}
