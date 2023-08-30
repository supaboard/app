"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { Resend } from "resend"
import { InvitationEmail } from "@/components/emails/invite"


export const updateMembers = async (memberData) => {
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

	let { email, invited_by_user_id, role, send_email } = memberData

	try {
		const query = await supabase.from("email_invitations").insert({
			email: email,
			account_id: account_id,
			invited_by_user_id: invited_by_user_id,
			role: role
		})

		if (send_email) {
			const { data: teamQuery, error } = await supabase
				.from("accounts")
				.select("team_name")
				.eq("id", account_id)
				.single()

			const res = await sendEmail(email, account_id, teamQuery.team_name, role)
			if (!res.id) {
				throw new Error("Failed to send email")
			}
		}

		return true
	} catch (error) {
		console.log(error)
		throw Error(error)
	}
}


export const sendEmail = async (email, account_id, team_name, role) => {
	const resend = new Resend(process.env.RESEND_API_KEY)
	const res = await resend.emails.send({
		from: "invite@supaboard.co",
		to: email,
		subject: "👋 You're invited to join your team on Supaboard",
		react: <InvitationEmail team_name={team_name} role={role} />,
	})

	return res
}

export const updateWorkspace = async (wokspace_id, formData) => {
	const supabase = createServerActionClient({ cookies }, {
		options: {
			db: { schema: "supaboard" }
		}
	})
	const { data: { session } } = await supabase.auth.getSession()
	if (!session) {
		throw new Error("Not authenticated")
	}

	if (!wokspace_id) {
		throw new Error("No workspace id provided")
	}

	const team_name = formData.get("team_name")

	const { data, error } = await supabase
		.from("accounts")
		.update([
			{ team_name: team_name }
		])
		.eq("id", wokspace_id)
		.select()
		.single()

	if (error) {
		console.log(error)
		throw Error(error)
	}

	return data
}


export const deleteWorkspace = async (wokspace_id) => {
	const supabase = createServerActionClient({ cookies }, {
		options: {
			db: { schema: "supaboard" }
		}
	})
	const { data: { session } } = await supabase.auth.getSession()
	if (!session) {
		throw new Error("Not authenticated")
	}

	if (!wokspace_id) {
		throw new Error("No workspace id provided")
	}

	const { data: dahboardsData, error: dahboardsError } = await supabase
		.from("dashboards")
		.delete()
		.eq("account_id", wokspace_id)

	const { data: accountUserData, error: accountUserError } = await supabase
		.from("account_user")
		.delete()
		.eq("account_id", wokspace_id)

	const { data: accountsData, error: accountsError } = await supabase
		.from("accounts")
		.delete()
		.eq("id", wokspace_id)

	if (accountUserError || accountsError || dahboardsError) {
		throw Error(accountUserError || accountsError || dahboardsError)
	}

	redirect("/settings/workspace")
}
