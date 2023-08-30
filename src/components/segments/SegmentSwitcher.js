"use client"

import Link from "next/link"
import { Menu, Transition } from "@headlessui/react"
import { Fragment, useEffect, useState } from "react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { PencilSquareIcon, TrashIcon, BackspaceIcon } from "@heroicons/react/24/outline"
import { usePathname } from "next/navigation"
import Tippy from "@tippyjs/react"
import { SegmentEditModal } from "./SegmentEditModal"
import { SegmentDeleteModal } from "./SegmentDeleteModal"
import { ContactResetModal } from "./ContactResetModal"


export function SegmentSwitcher({ children }) {
	const fullPath = usePathname()
	const activeUuid = fullPath.split("/")[2]
	const [loading, setLoading] = useState(true)
	const [selectedSegment, setSelectedsegment] = useState(null)
	const [segments, setSegments] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [showEditModal, setShowEditModal] = useState(false)
	const [showResetModal, setShowResetModal] = useState(false)
	const [showPublicModal, setShowPublicModal] = useState(false)
	const [updateHash, setUpdateHash] = useState(0)

	useEffect(() => {
		const getSegments = async () => {
			setLoading(true)
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/contacts/segments`)
			const data = await res.json()
			setSegments(data)
			setLoading(false)
		}

		getSegments()
	}, [fullPath, updateHash])


	return (
		<div className="relative flex items-center gap-x-2">
			<div className="">
				<Menu as="div" className="relative inline-block text-left">
					<div>
						<Menu.Button className="group inline-flex w-full justify-center rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-black hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
							{!loading && activeUuid && segments && segments.length > 0 && segments.find(dashboard => dashboard.uuid == activeUuid) && (
								segments.find(dashboard => dashboard.uuid == activeUuid).name
							)}
							{(loading || (!activeUuid || !segments || segments.length == 0)) && (
								<span>Choose a segment</span>
							)}
							<ChevronDownIcon
								className="ml-2 -mr-1 h-5 w-5 text-gray-400 group-hover:text-gray-700"
								aria-hidden="true"
							/>
						</Menu.Button>
					</div>
					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95"
					>
						<Menu.Items className="absolute left-0 mt-2 w-80 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
							<div className="px-1 py-1">
								<Menu.Item>
									{({ active }) => (
										<Link href={"/segments"}
											className={`${!activeUuid ? "bg-highlight text-white" : "text-gray-900 hover:bg-gray-50"
												} group flex w-full items-center rounded-md px-2 py-2 text-sm grow`}
										>
											<span className="grow max-w-[90%] text-ellipsis">All users</span>
											<Tippy content="Reset userbase" placement="right">
												<span
													className="opacity-0 group-hover:opacity-100 bg-white border border-gray-200 p-1 rounded cursor-pointer"
													onClick={(e) => {
														e.preventDefault()
														e.stopPropagation()
														setShowResetModal(true)
													}}
												>
													<BackspaceIcon className="h-4 w-4 text-gray-800" aria-hidden="true" />
												</span>
											</Tippy>
										</Link>
									)}
								</Menu.Item>
								{(!segments || segments.length == 0) && (
									<i className="text-gray-400 italic p-4 text-center block">No segments yet</i>
								)}
								{segments && segments.length > 0 && segments.map((segment) => (
									<Menu.Item key={segment.id}>
										{({ active }) => (
											<Link href={`/segments/${segment.uuid}`}
												className={`${segment.uuid == activeUuid ? "bg-highlight text-white" : "text-gray-900 hover:bg-gray-50"
													} group flex w-full items-center rounded-md px-2 py-2 text-sm grow`}
											>
												<span className="grow max-w-[90%] text-ellipsis">{segment.name}</span>
												<div className="flex items-center gap-x-1">
													<Tippy content="Edit segment" placement="right">
														<span
															className="opacity-0 group-hover:opacity-100 bg-white border border-gray-200 p-1 rounded cursor-pointer"
															onClick={(e) => {
																e.preventDefault()
																e.stopPropagation()
																setSelectedsegment(segment)
																setShowEditModal(true)
															}}
														>
															<PencilSquareIcon className="h-4 w-4 text-gray-800" aria-hidden="true" />
														</span>
													</Tippy>
													<Tippy content="Delete segment" placement="right">
														<span
															className="opacity-0 group-hover:opacity-100 bg-white border border-gray-200 p-1 rounded cursor-pointer"
															onClick={(e) => {
																e.preventDefault()
																e.stopPropagation()
																setSelectedsegment(segment)
																setShowDeleteModal(true)
															}}
														>
															<TrashIcon className="h-4 w-4 text-gray-800" aria-hidden="true" />
														</span>
													</Tippy>
												</div>
											</Link>
										)}
									</Menu.Item>
								))}
								<hr className="my-2" />
								<Menu.Item>
									{({ active }) => (
										<Link
											href="/segments/new"
											className="text-center place-content-center text-gray-900 hover:bg-gray-50 group flex w-full items-center rounded-md px-2 py-2 mb-1 text-sm grow"
										>
											+ Create a new segment
										</Link>
									)}
								</Menu.Item>
							</div>
						</Menu.Items>
					</Transition>
				</Menu>
			</div>

			<SegmentEditModal showModal={showEditModal} setShowModal={setShowEditModal} segment={selectedSegment} setUpdateHash={setUpdateHash} />
			<SegmentDeleteModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} segment={selectedSegment} setUpdateHash={setUpdateHash} />
			<ContactResetModal showModal={showResetModal} setShowModal={setShowResetModal} setUpdateHash={setUpdateHash} />
		</div>
	)
}
