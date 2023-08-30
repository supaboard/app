import "@/app/globals.css"

export const metadata = {
	title: "Supaboard — Supabase and Postgres dashboards",
	description: "Powerful reporting dashboards on top of Supabase.",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://app.supaboard.co",
		title: "Supaboard — Supabase and Postgres dashboards",
		description: "Powerful reporting dashboards on top of Supabase.",
		siteName: "Supaboard",
	},
	twitter: {
		card: "summary_large_image",
		title: "Supaboard — Supabase and Postgres dashboards",
		description: "Powerful reporting dashboards on top of Supabase.",
	}
}

export default function AuthLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<div className="container max-w-md px-4 md:px-2 mx-auto">
					{children}
				</div>
			</body>
		</html>
	)
}
