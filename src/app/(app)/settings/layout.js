import { SettingsNav } from "@/components/settings/SettingsNav"

export default async function SettingsLayout({ children }) {

	return (
		<div className="flex text-left">
			<div className="min-w-[350px]">
				<SettingsNav />
			</div>
			<div className="w-full p-8">
				{children}
			</div>
		</div>
	)
}
