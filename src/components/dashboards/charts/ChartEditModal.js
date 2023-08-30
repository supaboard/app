"use client"

import { useEffect, useState, useTransition } from "react"

import { useRouter } from "next/navigation"
import Modal from "@/components/util/Modal"
import { addChart } from "@/app/(app)/dashboards/actions"
import { ChartDataTable } from "../steps/ChartDataTable"

export function ChartEditModal({ chart, dashboard_uuid, showModal, setShowModal }) {
	const router = useRouter()
	let [isPending, startTransition] = useTransition()

	const [dashboard, setDashboard] = useState(null)
	const [filters, setFilters] = useState(null)
	const [filterType, setFilterType] = useState("simple")
	const [chartData, setChartData] = useState(null)
	const [name, setName] = useState(chart?.name || null)
	const [description, setDescription] = useState(chart?.description || null)

	const [selectedDataTable, setSelectedDataTable] = useState(null)
	const [selectedDataColumn, setSelectedDataColumn] = useState(null)
	const [selectedTimeTable, setSelectedTimeTable] = useState(null)
	const [selectedTimeColumn, setSelectedTimeColumn] = useState(null)


	useEffect(() => {
		if (!chart) return

		setFilterType(chart?.filters?.query ? "advanced" : "simple")
		setFilters(chart?.filters || [])
		setSelectedDataTable(chart?.dataTable || null)
		setSelectedDataColumn(chart?.dataCol || null)
		setSelectedTimeTable(chart?.timeTable || null)
		setSelectedTimeColumn(chart?.timeCol || null)

		const getDashboard = async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboards/${dashboard_uuid}`)
			if (!res.ok) {
				throw new Error("Failed to fetch data")
			}

			let data = await res.json()
			setDashboard(data)
		}

		const getChartData = async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/externaldb/${chart.database}`)
			const data = await res.json()
			setChartData(data)
		}

		getDashboard()
		getChartData()
	}, [chart])



	const saveChart = async () => {

		let config = {
			...dashboard.config,
			charts: [
				...dashboard?.config?.charts.filter((c) => c.id != chart.id) || [],
				{
					id: chart.id,
					type: chart.type,
					layout: chart.layout,
					database: chart.database,
					name: name,
					description: description,
					dataTable: selectedDataTable,
					dataCol: selectedDataColumn,
					timeTable: selectedTimeTable,
					timeCol: selectedTimeColumn,
					filters: filters,
				}
			]
		}

		startTransition(() => addChart(dashboard_uuid, config))
		if (!isPending) {
			setShowModal(false)
		}
	}


	return (
		<>
			<Modal
				showModal={showModal}
				onClose={() => setShowModal(false)}
			>
				<div>
					<div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
						<b className="text-xl font-black">Edit this chart</b>
					</div>
					<div className="p-6">
						<div className="mt-3">
							<label htmlFor="name">Chart name</label>
							<input
								type="text"
								name="name"
								id="name"
								className="form-input"
								placeholder="Chart name"
								defaultValue={chart?.name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className="mt-3">
							<label htmlFor="description">
								Description
							</label>
							<textarea
								name="description"
								id="description"
								className="form-input"
								placeholder="Helpful info about what the chart does for you and your team"
								defaultValue={chart?.description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
						<div className="mt-6">
							<ChartDataTable
								chart={chart}
								chartType={chart.type}
								chartData={chartData}
								filterType={filterType}
								setFilterType={setFilterType}
								selectedDataTable={selectedDataTable}
								setSelectedDataTable={setSelectedDataTable}
								selectedDataColumn={selectedDataColumn}
								setSelectedDataColumn={setSelectedDataColumn}
								selectedTimeTable={selectedTimeTable}
								setSelectedTimeTable={setSelectedTimeTable}
								selectedTimeColumn={selectedTimeColumn}
								setSelectedTimeColumn={setSelectedTimeColumn}
								filters={filters}
								setFilters={setFilters}
								activeStep={0}
								setActiveStep={null}
								reduced={true}
							/>
						</div>
					</div>
					<div className="flex gap-x-4 mt-10 place-content-end bg-gray-50 rounded-b-lg border-t border-gray-200 py-3 px-6">
						<button
							className="btn-secondary"
							onClick={() => setShowModal(false)}
						>
							Cancel
						</button>
						<button
							className="btn-default"
							onClick={saveChart}
						>
							Save chart
						</button>
					</div>
				</div>
			</Modal>
		</>
	)
}
