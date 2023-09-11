"use client"

import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { BoltIcon, ChartBarIcon, CircleStackIcon, CodeBracketIcon, HomeIcon, PencilSquareIcon, Square3Stack3DIcon, Squares2X2Icon, SquaresPlusIcon, TableCellsIcon, UserGroupIcon, WindowIcon, XMarkIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Link from "next/link"
import { classNames } from "@/components/util"
import { useSelectedLayoutSegment } from "next/navigation"
import useStore from "@/store/index"

import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"

import "@/app/globals.css"

const navigation = [
	{ name: "Overview", href: "/overview", icon: HomeIcon, current: true },
	{ name: "Dashboards", href: "/dashboards", icon: ChartBarIcon, current: false },
	{ name: "Panels", href: "/panels", icon: Square3Stack3DIcon, current: false },
	{ name: "User Segments", href: "/segments", icon: UserGroupIcon, current: false },
	// { name: 'Workflows', href: '/workflows', icon: BoltIcon, current: false },
	{ name: "Database Connections", href: "/databases", icon: CircleStackIcon, current: false },
]


export function Sidebar({ children }) {
	const { showSidebar, setShowSidebar } = useStore()
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const segment = useSelectedLayoutSegment()

	return (
		<>
			<Transition.Root show={showSidebar} as={Fragment}>
				<Dialog as="div" className="relative z-50 lg:hidden" onClose={setShowSidebar}>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-900/80" />
					</Transition.Child>

					<div className="fixed inset-0 flex">
						<Transition.Child
							as={Fragment}
							enter="transition ease-in-out duration-300 transform"
							enterFrom="-translate-x-full"
							enterTo="translate-x-0"
							leave="transition ease-in-out duration-300 transform"
							leaveFrom="translate-x-0"
							leaveTo="-translate-x-full"
						>
							<Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
								<Transition.Child
									as={Fragment}
									enter="ease-in-out duration-300"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in-out duration-300"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<div className="absolute left-full top-0 flex w-16 justify-center pt-5">
										<button type="button" className="-m-2.5 p-2.5" onClick={() => setShowSidebar(false)}>
											<span className="sr-only">Close sidebar</span>
											<XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
										</button>
									</div>
								</Transition.Child>

								<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-100 px-6 pb-2 ring-1 ring-white/10">
									<div className="flex h-16 shrink-0 items-center">
										<Image src="/img/supaboard.svg" alt="Supaboard" width={28} height={28} />
									</div>
									<nav className="flex flex-1 flex-col">
										<ul role="list" className="-mx-2 flex-1 space-y-1">
											{navigation.map((item) => (
												<li key={item.name}>
													<Link
														href={item.href}
														onClick={() => setShowSidebar(false)}
														className={classNames(
															segment == item.href.slice(1) ? "text-black bg-[#e5e7eb]" : "border-transparent text-gray-400 hover:bg-gray-300",
															"group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold mb-2"
														)}
													>
														<>
															<item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
															<span>{item.name}</span>
														</>
													</Link>
												</li>
											))}
										</ul>
									</nav>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>

			{/* Static sidebar for desktop */}
			<div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-100 border-r border-gray-300 lg:pb-4">
				<div className="flex h-16 shrink-0 items-center justify-center">
					<Link href="/">
						<Image src="/img/supaboard.svg" alt="Supaboard" width={28} height={28} />
					</Link>
				</div>
				<nav className="mt-8">
					<ul role="list" className="flex flex-col items-center space-y-1">
						{navigation.map((item) => (
							<li key={item.name}>
								<Tippy content={item.name} placement="right">
									<Link
										href={item.href}
										className={classNames(
											segment == item.href.slice(1) ? "text-black bg-[#e5e7eb]" : "border-transparent text-gray-400 hover:bg-gray-300",
											"group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold mb-2"
										)}
									>
										<>
											<item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
											<span className="sr-only">{item.name}</span>
										</>
									</Link>
								</Tippy>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</>
	)
}
