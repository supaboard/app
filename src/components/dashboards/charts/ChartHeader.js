"use client"

import { EllipsisHorizontalIcon, PencilSquareIcon, Square2StackIcon, TrashIcon } from "@heroicons/react/24/outline"
import { Menu, Transition } from "@headlessui/react"
import { Fragment, useEffect, useRef, useState } from "react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import useStore from "@/store/index"
import { ChartEditModal } from "./ChartEditModal"

export function ChartHeader({ dashboard_uuid, chartData, is_public }) {
	const { dashboard, setDashboard } = useStore()
	const [showEditModal, setShowEditModal] = useState(false)

	const deleteChart = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboards/${dashboard_uuid}/charts/${chartData.id}`, {
			method: "PUT",
			body: JSON.stringify({
				dashboard: dashboard
			})
		})
		const data = await res.json()
		setDashboard(data)
	}

	const duplicateChart = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboards/${dashboard_uuid}/charts/${chartData.id}`, {
			method: "PUT",
			body: JSON.stringify({
				dashboard: dashboard,
				duplicate: true
			})
		})
		const data = await res.json()
		setDashboard(data)
	}

	const editChart = () => {
		setShowEditModal(true)
	}

	return (
		<div className="chart-header bg-gray-50 p-4 rounded-t border-b border-gray-200 z-40">
			<div className="absolute left-0 top-0 h-10 drag-handle bg-transparent opacity-0 w-full"></div>
			<div className="flex">
				<b className="text-xl font-black block grow">{chartData.name}</b>
				{!is_public && (
					<div className="shrink-0">
						<Menu as="div" className="relative inline-block text-left z-40">
							<div>
								<Menu.Button className="w-8 h-8 bg-white inline-flex justify-center items-center rounded border border-gray-100">
									<EllipsisHorizontalIcon className="w-6 h-6 text-gray-500" />
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
								<Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									<div className="px-1 py-1">
										<Menu.Item>
											{({ active }) => (
												<button
													className={`${active ? "bg-violet-500 text-white" : "text-gray-900"
														} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
													onClick={editChart}
												>
													<PencilSquareIcon className="w-5 h-5 mr-2" aria-hidden="true" />
													Edit
												</button>
											)}
										</Menu.Item>
										<Menu.Item>
											{({ active }) => (
												<button
													className={`${active ? "bg-violet-500 text-white" : "text-gray-900"
														} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
													onClick={duplicateChart}
												>
													<Square2StackIcon className="w-5 h-5 mr-2" aria-hidden="true" />
													Duplicate
												</button>
											)}
										</Menu.Item>
										<Menu.Item>
											{({ active }) => (
												<button
													className={`${active ? "bg-violet-500 text-white" : "text-gray-900"
														} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
													onClick={deleteChart}
												>
													<TrashIcon className="w-5 h-5 mr-2" aria-hidden="true" />
													Delete this chart
												</button>
											)}
										</Menu.Item>
									</div>
								</Menu.Items>
							</Transition>
						</Menu>
					</div>
				)}
			</div>
			<p className="text-gray-500 text-md">
				{chartData.description}
			</p>

			<ChartEditModal showModal={showEditModal} setShowModal={setShowEditModal} chart={chartData} dashboard_uuid={dashboard_uuid} />

		</div>
	)
}
