"use client"

import Link from "next/link"
import { useSelectedLayoutSegment, usePathname } from "next/navigation"
import { classNames } from "@/components/util"

const navigation = [
	{ name: "Personal details", href: "/settings", current: true },
	{ name: "Workspaces", href: "/settings/workspace", current: false },
	{ name: "Billing", href: "/settings/billing", current: false },
]


export function SettingsNav({ children }) {
	const segment = useSelectedLayoutSegment()

	return (
		<nav>
			<ul role="list" className="flex flex-col border-r border-gray-200 divide-y divide-gray-200 h-[calc(100vh_-_70px)]">
				{navigation.map((item) => (
					<li key={item.name}>
						<Link
							href={item.href}
							className={classNames(
								segment == item.href.split("/")[2] ? "text-black font-bold bg-gray-50" : "text-gray-400",
								"block p-4"
							)}
						>
							<div className="">
								{item.name}
							</div>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	)
}
