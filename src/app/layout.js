import "@/app/globals.css"
import { UpgradeModal } from "@/components/UpgradeModal"
import { Telemetry } from "@/providers/Telemetry"

export const metadata = {
	metadataBase: new URL("https://app.supaboard.co"),
	title: "Supaboard — Supabase and Postgres dashboards",
	description: "Create reporting dashboards on top of Supabase with ease.",
	icons: {
		icon: "/favicon/favicon.png",
	},
}


export default function RootLayout({ children }) {
	if (process.env.IS_PLATFORM && process.env.NEXT_PUBLIC_ENV != "dev") {
		return (
			<Telemetry>
				{children}
				<UpgradeModal />
			</Telemetry>
		)
	} else {
		return (
			<html lang="en">
				<body>
					{children}
					<UpgradeModal />
				</body>
			</html>
		)
	}
}
