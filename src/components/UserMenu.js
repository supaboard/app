"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { Fragment, useState, useEffect } from "react"
import { Menu, Transition } from "@headlessui/react"
import { Bars3Icon, ChevronRightIcon, Cog6ToothIcon, CreditCardIcon, PowerIcon, RectangleStackIcon } from "@heroicons/react/24/outline"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { useSelectedLayoutSegment } from "next/navigation"
import useStore from "@/store/index"

import "tippy.js/dist/tippy.css"
import "@/app/globals.css"
import { DashboardSwitcher } from "@/components/dashboards/DashboardSwitcher"
import { WorkspaceSwitcher } from "@/components/WorkspaceSwitcher"
import Modal from "./util/Modal"
import { SegmentSwitcher } from "./segments/SegmentSwitcher"
import { getUserAccounts } from "@/lib/auth"

const userNavigation = [
	{ name: "Account settings", href: "/settings" },
	{ name: "Billing", href: "/billing" },
	{ name: "Change team", href: "#changeteam" },
	{ name: "Sign out", href: "#" },
]

export function UserMenu({ children }) {
	const segment = useSelectedLayoutSegment()
	const [showWorkspaceModal, setShowWorkspaceModal] = useState(false)
	const [activeAccount, setActiveAccount] = useState(null)
	const { showSidebar, setShowSidebar } = useStore()

	const supabase = createClientComponentClient({
		options: {
			db: { schema: "supaboard" }
		}
	})

	useEffect(() => {
		if (!document) return

		const currentlyActive = document.cookie.split("; ").find(row => row.startsWith("account_id"))?.split("=")[1] || null

		const getAccounts = async () => {
			const { data: { session } } = await supabase.auth.getSession()
			let response = await getUserAccounts(supabase, session.user.id)

			if (!currentlyActive) {
				setActiveAccount(response[0])
			} else {
				setActiveAccount(response.find(account => account.account_id === currentlyActive))
			}

		}

		getAccounts()
	}, [])


	const getHeadline = () => {
		switch (segment) {
			case "overview":
				return <Link href="/overview">Overview</Link>
			case "dashboards":
				return <Link href="/dashboards">Dashboards</Link>
			case "segments":
				return <Link href="/segments">User Segments</Link>
			case "databases":
				return <Link href="/databases">Databases</Link>
			case "panels":
				return <Link href="/panels">Panels</Link>
			case "workflows":
				return <Link href="/workflows">Workflows</Link>
			case "settings":
				return <Link href="/settings">Settings</Link>
			default:
				return "Overview"
		}
	}

	return (
		<>
			<div className="sticky top-0 z-40 flex py-3 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
				<button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setShowSidebar(true)}>
					<span className="sr-only">Open sidebar</span>
					<Bars3Icon className="h-6 w-6" aria-hidden="true" />
				</button>

				{/* Separator */}
				<div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

				<div className="flex items-center flex-1 gap-x-4 self-stretch lg:gap-x-6">
					<h1 className={`relative !text-lg ${(segment === "dashboards" || segment === "segments") ? "shrink-0" : "grow"} text-xl font-black`}>
						{getHeadline()}
					</h1>
					{segment === "dashboards" && (
						<>
							<div className="grow flex items-center gap-x-4">
								<ChevronRightIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
								<DashboardSwitcher />
							</div>
						</>
					)}
					{segment === "segments" && (
						<>
							<div className="grow flex items-center gap-x-4">
								<ChevronRightIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
								<SegmentSwitcher />
							</div>
						</>
					)}
					<div className="flex items-center gap-x-4 lg:gap-x-6">
						{/* <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
							<span className="sr-only">View notifications</span>
							<BellIcon className="h-6 w-6" aria-hidden="true" />
						</button> */}

						{/* Separator */}
						{/* <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" /> */}

						{/* Profile dropdown */}
						<Menu as="div" className="relative">
							<Menu.Button className="-m-1.5 flex items-center p-1.5">
								<span className="sr-only">Open user menu</span>
								<div className="shrink-0 flex items-center justify-center w-8 h-8 text-sm bg-gray-100 border border-gray-200 rounded-full">
									{activeAccount?.accounts?.team_name && (
										activeAccount?.accounts?.team_name[0].toUpperCase()
									)}
									{!activeAccount?.accounts?.team_name && (
										<>P</>
									)}
								</div>
								<span className="hidden lg:flex lg:items-center">
									<span className="ml-4 text-sm font-semibold leading-6 text-gray-900 max-w-[150px] truncate" aria-hidden="true">
										<>
											{activeAccount?.accounts?.team_name ? activeAccount?.accounts?.team_name : "Personal"}
										</>
									</span>
									<ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
								</span>
							</Menu.Button>
							<Transition
								as={Fragment}
								enter="transition ease-out duration-100"
								enterFrom="transform opacity-0 scale-95"
								enterTo="transform opacity-100 scale-100"
								leave="transition ease-in duration-75"
								leaveFrom="transform opacity-100 scale-100"
								leaveTo="transform opacity-0 scale-95"
							>
								<Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
									<div className="px-1 py-1 ">
										<Menu.Item>
											{({ active }) => (
												<Link
													href="/settings"
													className={`${active ? "bg-gray-200 text-gray-900" : "text-gray-900"
														} group flex w-full items-center rounded-md px-2 py-2 text-sm group`}
												>
													<Cog6ToothIcon
														className="w-5 h-5 mr-2 group-hover:text-gray-900"
														aria-hidden="true"
													/>
													Settings
												</Link>
											)}
										</Menu.Item>
									</div>
									<div className="px-1 py-1 ">
										<Menu.Item>
											{({ active }) => (
												<Link
													href="/settings/billing"
													className={`${active ? "bg-gray-200 text-gray-900" : "text-gray-900"
														} group flex w-full items-center rounded-md px-2 py-2 text-sm group`}
												>
													<CreditCardIcon
														className="w-5 h-5 mr-2 group-hover:text-gray-900"
														aria-hidden="true"
													/>
													Billing
												</Link>
											)}
										</Menu.Item>
									</div>
									<div className="px-1 py-1 ">
										<Menu.Item>
											{({ active }) => (
												<button
													className={`${active ? "bg-gray-200 text-gray-900" : "text-gray-900"
														} group flex w-full items-center rounded-md px-2 py-2 text-sm group`}
													onClick={() => {
														setShowWorkspaceModal(true)
													}}
												>
													<RectangleStackIcon
														className="w-5 h-5 mr-2 group-hover:text-gray-900"
														aria-hidden="true"
													/>
													Change workspace
												</button>
											)}
										</Menu.Item>
									</div>
									<hr className="my-1" />
									<div className="px-1 py-1 ">
										<Menu.Item>
											{({ active }) => (
												<button
													className={`${active ? "bg-gray-200 text-gray-900" : "text-gray-900"
														} group flex w-full items-center rounded-md px-2 py-2 text-sm group`}
													onClick={() => {
														setShowWorkspaceModal(true)
													}}
												>
													<PowerIcon
														className="w-5 h-5 mr-2 group-hover:text-gray-900"
														aria-hidden="true"
													/>
													Sign out
												</button>
											)}
										</Menu.Item>
									</div>
								</Menu.Items>
							</Transition>
						</Menu>
					</div>
				</div>
			</div>

			<Modal
				showModal={showWorkspaceModal}
				onClose={() => setShowWorkspaceModal(false)}
			>
				<WorkspaceSwitcher modalState={setShowWorkspaceModal} />
			</Modal>
		</>
	)
}
