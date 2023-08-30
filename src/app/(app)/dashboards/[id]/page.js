"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChartBarIcon } from "@heroicons/react/24/outline"
import GridLayout from "react-grid-layout"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import { Toaster, toast } from "sonner"
import { DateRangePicker } from "rsuite"
import "rsuite/dist/rsuite-no-reset.min.css"

import { AreaChart } from "@/components/dashboards/charts/AreaChart"
import { CounterChart } from "@/components/dashboards/charts/CounterChart"
import Loading from "@/components/Loading"
import useStore from "@/store/index"
import { BarChart } from "@/components/dashboards/charts/BarChart"
import { PieChart } from "@/components/dashboards/charts/PieChart"
import { TableChart } from "@/components/dashboards/charts/TableChart"
import ChartErrorBoundary from "@/components/dashboards/charts/ChartErrorBoundary"

let defualtTimeframe = [
	new Date(new Date().setDate(new Date().getDate() - 7)),
	new Date()
]

export default function Dashboard({ params }) {
	const { id } = params
	const [loading, setLoading] = useState(true)
	const { dashboard, setDashboard } = useStore()
	const [layout, setLayout] = useState(null)
	const [gridWidth, setGridWidth] = useState(1200)
	const [timeframe, setTimeframe] = useState(null)

	useEffect(() => {
		const getDashboard = async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboards/${params.id}`)
			if (!res.ok) {
				throw new Error("Failed to fetch data")
			}

			const data = await res.json()
			const layout = data?.config?.charts?.map((chart) => {
				const layout = chart.layout
				return {
					i: chart.id.toString(),
					x: layout?.x || 0,
					y: layout?.y || 0,
					w: layout?.w || 12,
					h: layout?.h || 6,
				}
			})

			if (data?.config?.timeframe && typeof data.config.timeframe == "object") {
				setTimeframe([
					new Date(data.config.timeframe[0]),
					new Date(data.config.timeframe[1])
				])
			} else {
				setTimeframe(defualtTimeframe)
			}
			setDashboard(data)
			setLayout(layout)
			setLoading(false)
		}

		getDashboard()
	}, [params])


	useEffect(() => {
		setGridWidth(window.innerWidth - 80)
		window.addEventListener("resize", () => {
			setGridWidth(window.innerWidth - 80)
		})

		return () => {
			window.removeEventListener("resize", () => {
				setGridWidth(window.innerWidth - 80)
			})
		}
	}, [])


	const handleTimeframeChange = (newTimeframe) => {
		setTimeframe(newTimeframe)
		setDashboard({
			...dashboard,
			config: {
				...dashboard.config,
				timeframe: newTimeframe
			}
		})
	}


	const saveLayout = async () => {
		const charts = dashboard.config.charts.map((chart) => {
			const chartLayout = layout.find((l) => l.i == chart.id)
			return { ...chart, layout: chartLayout }
		})

		const config = { ...dashboard.config, charts }

		const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboards/${params.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ config })
		})

		if (!res.ok) {
			throw new Error("Failed to save dashboard")
		}

		setLayout(layout)
		setDashboard({ ...dashboard, config })
		toast.success("Dashboard saved")
	}

	const handleLayoutChange = async (layout) => {
		setLayout(layout)
	}

	return (
		<div className="overflow-y-scroll h-100">
			<div className="flex items-center px-8 gap-x-4 place-content-end bg-gray-50 border-b border-gray-200 divide-x divide-gray-200 font-semibold text-sm p-3">

				{timeframe && (
					<DateRangePicker
						placeholder="All time"
						style={{ width: 230 }}
						value={timeframe}
						onChange={(value) => {
							handleTimeframeChange(value)
						}}
					/>
				)}

				<Link href={`/dashboards/${id}/add-chart`}>
					<button className="btn-secondary bg-white">
						Add chart
					</button>
				</Link>
				<button
					className="btn-default"
					onClick={saveLayout}
				>
					Save dashboard
				</button>
			</div>
			<div className="py-8">
				{loading && (
					<div className="relative max-w-xl mx-auto block w-full rounded p-12 text-center">
						<div className="w-14 h-14 bg-dark border-4 border-highlight rounded-lg -rotate-6 relative mx-auto shadow-xl drop-shadow-lg">
							<Loading className="mt-2.5" />
						</div>
						<span className="mt-6 block text-sm text-gray-500 mx-auto">
							Loading your dashboard...
						</span>
					</div>
				)}

				{!loading && dashboard?.config?.charts?.length > 0 && layout && (
					<GridLayout
						className="layout"
						layout={layout}
						onLayoutChange={handleLayoutChange}
						cols={12}
						width={gridWidth}
						margin={[20, 20]}
						draggableHandle=".drag-handle"
						verticalCompact={false}
					>
						{dashboard.config.charts.map((chart) => (
							<div className="bg-white border border-gray-200 rounded" key={chart.id.toString()}>
								{chart.type == "area" && (
									<ChartErrorBoundary>
										<AreaChart dashboard_uuid={id} chartData={chart} timeframe={timeframe} />
									</ChartErrorBoundary>
								)}
								{chart.type == "counter" && (
									<ChartErrorBoundary>
										<CounterChart dashboard_uuid={id} chartData={chart} timeframe={timeframe} />
									</ChartErrorBoundary>
								)}
								{chart.type == "bar" && (
									<ChartErrorBoundary>
										<BarChart dashboard_uuid={id} chartData={chart} timeframe={timeframe} />
									</ChartErrorBoundary>
								)}
								{chart.type == "pie" && (
									<ChartErrorBoundary>
										<PieChart dashboard_uuid={id} chartData={chart} timeframe={timeframe} />
									</ChartErrorBoundary>
								)}
								{chart.type == "table" && (
									<ChartErrorBoundary>
										<TableChart dashboard_uuid={id} chartData={chart} timeframe={timeframe} />
									</ChartErrorBoundary>
								)}
							</div>
						))}
					</GridLayout>
				)}

				{!loading && (!dashboard || !dashboard.config || !dashboard?.config?.charts || dashboard?.config?.charts?.length == 0) && (
					<div className="relative max-w-xl mx-auto block w-full rounded p-12 text-center">
						<div className="w-14 h-14 bg-dark border-4 border-highlight rounded-lg -rotate-6 relative mx-auto shadow-xl drop-shadow-lg">
							<ChartBarIcon className="w-8 h-8 mx-auto text-highlight absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
						</div>
						<span className="mt-6 block text-sm text-gray-500 mx-auto">
							<b className="block text-lg">Start analyzing your data</b>
							<p className="mt-2">
								Add charts to your dashboard to visualize your data, then arrange and resize them however you like.
							</p>
						</span>
						<Link href={`/dashboards/${id}/add-chart`} className="inline-block btn-default mt-6">
							Add first chart
						</Link>
					</div>
				)}
			</div>
			<Toaster position="top-right" />
		</div>
	)
}
