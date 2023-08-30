"use client"

import { useState, useEffect } from "react"
import { ChartHeader } from "./ChartHeader"
import Loading from "@/components/Loading"
import { ChartError } from "./ChartError"


export function CounterChart({ dashboard_uuid, chartData, timeframe, is_public }) {
	const [counter, setCounter] = useState(null)
	const [loading, setLoading] = useState(true)
	const [headerSize, setHeaderSize] = useState(60)
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

			let timeCol = chartData.timeCol

			// Limit data to timeframe
			if (timeframe) {
				const start = new Date(timeframe[0]).getTime()
				const end = new Date(timeframe[1]).getTime()
				const filteredData = data.filter((item) => {
					const timestamp = new Date(item[timeCol]).getTime()
					return timestamp >= start && timestamp <= end
				})
				setCounter(filteredData.length)
			} else {
				setCounter(data.length)
			}

			setLoading(false)
		}

		fetchChartData()
	}, [chartData, dashboard_uuid, timeframe])

	useEffect(() => {
		const header = document.querySelector(".chart-header")
		if (!header) return
		setHeaderSize(header.offsetHeight)
	}, [headerSize])


	return (
		<div className="relative h-full">
			<ChartHeader dashboard_uuid={dashboard_uuid} chartData={chartData} is_public={is_public} />
			<div className={"flex items-center justify-center relative w-full "} style={{ height: `calc(100% - ${headerSize}px)` }}>
				<div className="text-center text-6xl font-black color-highlight p-4 flex-1">
					{loading && !hasError && (
						<Loading />
					)}
					{!loading && !hasError && (
						<>
							{counter}
						</>
					)}
					{!loading && hasError && (
						<ChartError />
					)}
				</div>
			</div>
		</div>
	)
}
