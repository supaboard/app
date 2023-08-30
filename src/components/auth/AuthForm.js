"use client"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect } from "react"

export default function AuthForm({ view }) {
	const supabase = createClientComponentClient()

	useEffect(() => {
		const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
			if (session) {
				window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
			}
		})
	}, [])

	return (
		<div className="border border-gray-200 rounded-lg p-4 mt-6">
			<Auth
				supabaseClient={supabase}
				view={view}
				appearance={{
					theme: ThemeSupa,
					variables: {
						default: {
							colors: {
								brand: "#444",
								brandAccent: "#444"
							}
						}
					}
				}}
				theme="light"
				showLinks={true}
				providers={[]}
			/>
		</div>
	)
}
