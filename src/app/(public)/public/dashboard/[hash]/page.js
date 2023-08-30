"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ChartBarIcon } from "@heroicons/react/24/outline"
import GridLayout from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import { Toaster, toast } from "sonner";

import { AreaChart } from "@/components/dashboards/charts/AreaChart"
import { CounterChart } from "@/components/dashboards/charts/CounterChart"
import Loading from "@/components/Loading"
import useStore from "@/store/index"
import { BarChart } from "@/components/dashboards/charts/BarChart";
import { PieChart } from "@/components/dashboards/charts/PieChart";
import { TableChart } from "@/components/dashboards/charts/TableChart";



export default function PublicDashboard({ params }) {
	const [loading, setLoading] = useState(true)
	const { dashboard, setDashboard } = useStore()
	const [layout, setLayout] = useState(null)
	const [gridWidth, setGridWidth] = useState(1200)
	const [unableToLoad, setUnableToLoad] = useState(false)

	useEffect(() => {
		const getDashboard = async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboards/hash/${params.hash}`)
			if (!res.ok) {
				setLoading(false)
				setUnableToLoad(true)
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

			setDashboard(data)
			setLayout(layout)
			setLoading(false)
		}

		getDashboard()
	}, [params])


	const handleLayoutChange = async (layout) => {
		setLayout(layout)
	}

	useEffect(() => {
		setGridWidth(window.innerWidth - 40)
		window.addEventListener("resize", () => {
			setGridWidth(window.innerWidth - 40)
		})

		return () => {
			window.removeEventListener("resize", () => {
				setGridWidth(window.innerWidth - 40)
			})
		}
	}, [])


	return (
		<div className="relative h-screen">
			{loading && (
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-xl mx-auto block w-full text-center p-12" >
					<div className="w-14 h-14 bg-dark border-4 border-highlight rounded-lg -rotate-6 relative mx-auto shadow-xl drop-shadow-lg">
						<Loading className="mt-2.5" />
					</div>
					<span className="mt-6 block text-sm text-gray-500 mx-auto">
						Loading dashboard...
					</span>
				</div>
			)}

			{!loading && unableToLoad && (
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-xl mx-auto block w-full text-center p-12" >
					<div className="w-14 h-14 bg-dark border-4 border-highlight rounded-lg -rotate-6 relative mx-auto shadow-xl drop-shadow-lg">
						<ChartBarIcon className="w-8 h-8 mx-auto text-highlight absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
					</div>
					<span className="mt-6 block text-sm text-gray-500 mx-auto">
						<b className="block text-lg">Dashboard not found</b>
						<p className="mt-2">
							We couldn&apos;t find the dashboard you&apos;re looking for. <br/>
							Maybe it was deleted or you don&apos;t have access to it.
						</p>
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
					isDraggable={false}
					isResizable={false}
				>
					{dashboard.config.charts.map((chart) => (
						<div className="bg-white border border-gray-200 rounded" key={chart.id.toString()}>
							{chart.type == "area" && (
								<AreaChart dashboard_uuid={dashboard?.uuid} chartData={chart} is_public={true} />
							)}
							{chart.type == "counter" && (
								<CounterChart dashboard_uuid={dashboard?.uuid} chartData={chart} is_public={true} />
							)}
							{chart.type == "bar" && (
								<BarChart dashboard_uuid={dashboard?.uuid} chartData={chart} is_public={true} />
							)}
							{chart.type == "pie" && (
								<PieChart dashboard_uuid={dashboard?.uuid} chartData={chart} is_public={true} />
							)}
							{chart.type == "table" && (
								<TableChart dashboard_uuid={dashboard?.uuid} chartData={chart} is_public={true} />
							)}
						</div>
					))}
				</GridLayout>
			)}

			{!loading && !unableToLoad && (!dashboard || !dashboard.config || !dashboard?.config?.charts || dashboard?.config?.charts?.length == 0) && (
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-xl mx-auto block w-full rounded border bg-gray-50 border-gray-300 p-12 text-center shadow-inner">
					<div className="w-14 h-14 bg-dark border-4 border-highlight rounded-lg -rotate-6 relative mx-auto shadow-xl drop-shadow-lg">
						<ChartBarIcon className="w-8 h-8 mx-auto text-highlight absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
					</div>
					<span className="mt-6 block text-sm text-gray-500 mx-auto">
						<b className="block text-lg">No charts found</b>
						<p className="mt-2">
							There are no charts on this dashboard yet.
						</p>
					</span>
				</div>
			)}
		</div>
	)
}
