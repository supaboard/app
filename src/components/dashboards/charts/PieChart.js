"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })
import { ChartHeader } from "./ChartHeader"
import Loading from "@/components/Loading"
import { ChartError } from "./ChartError"


export function PieChart({ dashboard_uuid, chartData, timeframe, is_public }) {
	const [chartOptions, setChartOptions] = useState({})
	const [chartSeries, setChartSeries] = useState([])
	const [loading, setLoading] = useState(true)
	const [hasError, setHasError] = useState(false)

	useEffect(() => {
		if (!chartData) return
		if (!dashboard_uuid) return

		const fetchChartData = async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboards/data`, {
				method: "POST",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					dashboard_uuid: dashboard_uuid,
					...chartData
				})
			})

			const data = await res.json()
			if (!data || data.length === 0 || !res.ok) {
				setHasError(true)
			}

			let dataCol = chartData.dataCol
			let timeCol = chartData.timeCol

			let UsageByDay = data.data.reduce((acc, item) => {
				const date = new Date(item[timeCol])
				const day = date.getDate()
				const month = date.getMonth() + 1
				const year = date.getFullYear()
				const key = `${year}-${month}-${day}`
				if (!acc[key]) {
					acc[key] = 0
				}
				acc[key] += 1
				return acc
			}, {})

			// Limit data to timeframe
			if (timeframe) {
				UsageByDay = Object.keys(UsageByDay).reduce((acc, key) => {
					const date = new Date(key)
					const timestamp = date.getTime()
					const timestampFrame = timeframe.map((t) => new Date(t).getTime())
					if (timestamp >= timeframe[0] && timestamp <= timeframe[1]) {
						acc[key] = UsageByDay[key]
					}
					return acc
				}
					, {})
			}

			let series = []
			let labels = []

			data.map((dataPoint) => {
				series.push(dataPoint.source_ids.length)
				labels.push(dataPoint.name)
			})

			setChartOptions({
				chart: {
					id: "donut",
					toolbar: {
						show: false
					}
				},
				labels: labels,
				dataLabels: {
					style: {
						colors: ["#444"]
					}
				}
			})

			setChartSeries(series)
			setLoading(false)
		}

		fetchChartData()
	}, [chartData, dashboard_uuid, timeframe])

	return (
		<div className="realtive h-100">
			<ChartHeader dashboard_uuid={dashboard_uuid} chartData={chartData} is_public={is_public} />
			<div className="p-4 h-full relative min-h-[400px]">
				{loading && !hasError && (
					<Loading className="!w-auto !h-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
				)}
				{!loading && !hasError && (
					<Chart
						options={chartOptions}
						series={chartSeries}
						type="donut"
						width="100%"
						height="400"
					/>
				)}
				{!loading && hasError && (
					<ChartError />
				)}
			</div>
		</div>
	)
}
