"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import { ChartDataTable } from "@/components/dashboards/steps/ChartDataTable"
import { ChartOptions } from "@/components/dashboards/steps/ChartOptions"
import { ChartTypes } from "@/components/dashboards/steps/ChartTypes"
import { addChart } from "@/app/(app)/dashboards/actions"
import { useRouter } from "next/navigation"
import { ChartDatabase } from "@/components/dashboards/steps/ChartDatabase"

const layoutDefaults = {
	"area": {
		h: 6,
		w: 12,
	},
	"bar": {
		h: 6,
		w: 12,
	},
	"counter": {
		h: 6,
		w: 6,
	},
}

export default function NewChart({ params }) {
	const { id: dashboard_uuid } = params
	const router = useRouter()
	let [isPending, startTransition] = useTransition()
	const [activeStep, setActiveStep] = useState(1)
	const [chartType, setChartType] = useState(null)
	const [chartData, setChartData] = useState([])
	const [databases, setDatabases] = useState([])
	const [database, setDatabase] = useState(null)
	const [dashboard, setDashboard] = useState(null)

	const [filterType, setFilterType] = useState("simple")
	const [selectedDataTable, setSelectedDataTable] = useState(null)
	const [selectedDataColumn, setSelectedDataColumn] = useState(null)
	const [selectedTimeTable, setSelectedTimeTable] = useState(null)
	const [selectedTimeColumn, setSelectedTimeColumn] = useState(null)
	const [filters, setFilters] = useState([])

	const [options, setOptions] = useState({})

	useEffect(() => {
		const getDashboard = async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboards/${dashboard_uuid}`)
			if (!res.ok) {
				throw new Error("Failed to fetch data")
			}

			let data = await res.json()
			setDashboard(data)
		}

		const getDatabases = async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/databases`)
			if (!res.ok) {
				throw new Error("Failed to fetch data")
			}

			let data = await res.json()
			setDatabases(data)
			setDatabase(data[0].uuid)
		}

		getDatabases()
		getDashboard()
	}, [dashboard_uuid])



	useEffect(() => {
		if (activeStep === 1) {
			// ...
		}
		if (activeStep === 2) {
			// ...
		}
		if (activeStep === 3) {
			const getChartData = async () => {
				const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/externaldb/${database}`)
				const data = await res.json()
				setChartData(data)
				setSelectedDataTable(data[0].name)
				setSelectedTimeTable(data[0].name)
			}
			getChartData()
		}
		if (activeStep === 4) {
			// ...
		}
	}, [activeStep, database])


	const saveChart = async () => {
		let config = {
			...dashboard.config,
			charts: [
				...dashboard?.config?.charts || [],
				{
					id: new Date().getTime(),
					name: options.name,
					description: options.description,
					type: chartType,
					dataTable: selectedDataTable,
					dataCol: selectedDataColumn,
					timeTable: selectedTimeTable,
					timeCol: selectedTimeColumn,
					filters: filters,
					layout: layoutDefaults[chartType],
					database: database
				}
			]
		}

		startTransition(() => addChart(dashboard_uuid, config))
		if (!isPending) {
			router.push(`/dashboards/${dashboard_uuid}`)
		}
	}

	return (
		<>
			<div className="flex items-center border-b border-gray-200 divide-x divide-gray-200 font-semibold text-sm">
				<div className={`flex items-center place-content-center gap-x-2 grow text-center p-4 ${activeStep == 1 ? "opacity-100 bg-gray-50" : "opacity-25"}`}>
					<div className="bg-highlight text-white rounded w-6 h-6 pt-0.5">1</div>
					<span>Choose chart type</span>
				</div>
				<div className={`flex items-center place-content-center gap-x-2 grow text-center p-4 ${activeStep == 2 ? "opacity-100 bg-gray-50" : "opacity-25"}`}>
					<div className="bg-highlight text-white rounded w-6 h-6 pt-0.5">2</div>
					<span>Choose a database</span>
				</div>
				<div className={`flex items-center place-content-center gap-x-2 grow text-center p-4  ${activeStep == 3 ? "opacity-100 bg-gray-50" : "opacity-25"}`}>
					<div className="bg-highlight text-white rounded w-6 h-6 pt-0.5">3</div>
					<span>Filter your data</span>
				</div>
				<div className={`flex items-center place-content-center gap-x-2 grow text-center p-4 ${activeStep == 4 ? "opacity-100 bg-gray-50" : "opacity-25"}`}>
					<div className="bg-highlight text-white rounded w-6 h-6 pt-0.5">4</div>
					<span>Chart options</span>
				</div>
			</div>
			<div className="py-8 p-8">
				<div className="mt-4">
					{activeStep == 1 && (
						<>
							<div className="">
								<ChartTypes
									chartType={chartType}
									setChartType={setChartType}
									setActiveStep={setActiveStep}
								/>
							</div>
							<div className="flex items-center mt-4">
								<div className="text-left">
									<Link href={`/dashboards/${dashboard_uuid}`} className="btn-secondary flex items-center grow" >
										Cancel
									</Link>
								</div>
								<div className="flex grow place-content-end">
									<button
										className={`btn-default flex items-center float-right ${chartType ? "" : "opacity-50"}`}
										onClick={() => {
											setActiveStep(activeStep + 1)
										}}
										disabled={!chartType}
									>
										Next
										<ArrowRightIcon className="h-4 w-4 ml-2" />
									</button>
								</div>
							</div>
						</>
					)}

					{activeStep == 2 && (
						<>
							<div className="">
								<ChartDatabase
									databases={databases}
									setDatabase={setDatabase}
									activeStep={activeStep}
									setActiveStep={setActiveStep}
								/>
							</div>

						</>
					)}

					{activeStep == 3 && (
						<>
							<div className="">
								<ChartDataTable
									chartType={chartType}
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
									activeStep={activeStep}
									setActiveStep={setActiveStep}
								/>
							</div>

						</>
					)}

					{activeStep == 4 && (
						<>
							<div className="">
								<ChartOptions
									chartType={chartType}
									options={options}
									setOptions={setOptions}
									saveChart={saveChart}
									activeStep={activeStep}
									setActiveStep={setActiveStep}
								/>
							</div>
						</>
					)}

				</div>
			</div>
		</>
	)
}
