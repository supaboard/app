import { Toaster } from "sonner"
import "tippy.js/dist/tippy.css"
import "@/app/globals.css"

import { Sidebar } from "@/components/Sidebar"
import { UserMenu } from "@/components/UserMenu"

export default async function RootLayout({ children }) {
	return (
		<>
			<div>
				<Sidebar />
				<div className="lg:pl-20 h-screen">
					<UserMenu />
					<main>
						<div className="text-left">
							{children}
						</div>
					</main>
				</div>
			</div>
			<Toaster />
		</>
	)
}
