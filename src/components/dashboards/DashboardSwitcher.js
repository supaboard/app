"use client"

import Link from "next/link"
import { Menu, Transition } from "@headlessui/react"
import { Fragment, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { useSelectedLayoutSegment } from "next/navigation"
import { ArrowTopRightOnSquareIcon, EllipsisHorizontalIcon, PencilSquareIcon, TrashIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { usePathname } from "next/navigation"
import Tippy from "@tippyjs/react"

import { DashboardNewModal } from "./DashboardNewModal"
import { DashboardEditModal } from "./DashboardEditModal"
import { DashboardDeleteModal } from "./DashboardDeleteModal"
import { DashboardPublicModal } from "./DashboardPublicModal"


export function DashboardSwitcher({ children }) {
    const fullPath = usePathname()
    const activeUuid = fullPath.split("/")[2]
	const searchParams = useSearchParams()
	const forceNewModal = searchParams.get("new")
    const [loading, setLoading] = useState(true)
    const [selectedDashboard, setSelectedDashboard] = useState(null)
    const [dashboards, setDashboards] = useState(false)
    const [showModal, setShowModal] = useState(forceNewModal ? true : false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showPublicModal, setShowPublicModal] = useState(false)
    const [updateHash, setUpdateHash] = useState(0)

    useEffect(() => {
        const getDashboards = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboards`)
            if (!res.ok) {
                throw new Error("Failed to fetch data")
            }

            let data = await res.json()
            setDashboards(data)
            setLoading(false)
        }

        getDashboards()
    }, [fullPath, updateHash])

    return (
        <div className="relative flex items-center gap-x-2">
            <div className="">
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className="group inline-flex w-full justify-center rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-black hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                            {!loading && activeUuid && dashboards && dashboards.length > 0 && dashboards.find(dashboard => dashboard.uuid == activeUuid) && (
                                dashboards.find(dashboard => dashboard.uuid == activeUuid).name
                            )}
                            {(loading || (!activeUuid || !dashboards || dashboards.length == 0)) && (
                                <span>Choose a dashboard</span>
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
                                {(!dashboards || dashboards.length == 0) && (
                                    <i className="text-gray-400 italic p-4 text-center block">No dashboards yet</i>
                                )}
                                {dashboards && dashboards.length > 0 && dashboards.map((dashboard) => (
                                    <Menu.Item key={dashboard.id}>
                                        {({ active }) => (
                                            <Link href={`/dashboards/${dashboard.uuid}`}
                                                className={`${dashboard.uuid == activeUuid ? "bg-highlight text-white" : "text-gray-900 hover:bg-gray-50"
                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm grow`}
                                            >
                                                <span className="grow max-w-[90%] text-ellipsis">{dashboard.name}</span>
                                                <div className="flex items-center gap-x-1">
                                                    <Tippy content="Edit dashboard" placement="right">
                                                        <span
                                                            className="opacity-0 group-hover:opacity-100 bg-white border border-gray-200 p-1 rounded cursor-pointer"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                setSelectedDashboard(dashboard)
                                                                setShowEditModal(true)
                                                            }}
                                                        >
                                                            <PencilSquareIcon className="h-4 w-4 text-gray-800" aria-hidden="true" />
                                                        </span>
                                                    </Tippy>
                                                    <Tippy content="Share dashboard" placement="right">
                                                        <span
                                                            className="opacity-0 group-hover:opacity-100 bg-white border border-gray-200 p-1 rounded cursor-pointer"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                setSelectedDashboard(dashboard)
                                                                setShowPublicModal(true)
                                                            }}
                                                        >
                                                            <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-800" aria-hidden="true" />
                                                        </span>
                                                    </Tippy>
                                                    <Tippy content="Delete dashboard" placement="right">
                                                        <span
                                                            className="opacity-0 group-hover:opacity-100 bg-white border border-gray-200 p-1 rounded cursor-pointer"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                setSelectedDashboard(dashboard)
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
                                        <button
                                            className="text-center place-content-center text-gray-900 hover:bg-gray-50 group flex w-full items-center rounded-md px-2 py-2 mb-1 text-sm grow"
                                            onClick={() => setShowModal(true)}
                                        >
                                            + Create a new dashboard
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
            {activeUuid && (
                <div>
                    {dashboards && dashboards?.find(dashboard => dashboard.uuid == activeUuid)?.is_public ? (
                        <Tippy content="This dashboard is public. Anyone with the shareable link can see it." placement="bottom">
                            <span className="rounded uppercase bg-gray-100 text-xs py-2 px-3">
                                <EyeIcon className="h-4 w-4 inline-block mr-1" aria-hidden="true" />
                            </span>
                        </Tippy>
                    ) : (
                        <Tippy content="This dashboard is private. Only you can see it." placement="bottom">
                            <span className="rounded uppercase bg-gray-100 text-xs py-2 px-3">
                                <EyeSlashIcon className="h-4 w-4 inline-block mr-1" aria-hidden="true" />
                            </span>
                        </Tippy>
                    )}
                </div>
            )}

            <DashboardNewModal showModal={showModal} setShowModal={setShowModal} />
            <DashboardDeleteModal dashboard={selectedDashboard} showModal={showDeleteModal} setShowModal={setShowDeleteModal} />
            <DashboardEditModal dashboard={selectedDashboard} showModal={showEditModal} setShowModal={setShowEditModal} setUpdateHash={setUpdateHash} />
            <DashboardPublicModal dashboard={selectedDashboard} showModal={showPublicModal} setShowModal={setShowPublicModal} setUpdateHash={setUpdateHash} />
        </div>
    )
}
