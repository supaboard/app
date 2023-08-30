"use client"

import { useState, useEffect } from "react"
import { ChartHeader } from "./ChartHeader"
import Loading from "@/components/Loading"
import { ChartError } from "./ChartError"

export function TableChart({ dashboard_uuid, chartData, is_public }) {
    const [data, setData] = useState(null)
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

            setData(data)
            setLoading(false)
        }

        fetchChartData()
    }, [chartData, dashboard_uuid])

    useEffect(() => {
        const header = document.querySelector(".chart-header")
        if (!header) return
        setHeaderSize(header.offsetHeight)
    }, [headerSize])


    return (
        <div className="relative h-full">
            <ChartHeader dashboard_uuid={dashboard_uuid} chartData={chartData} is_public={is_public} />
            <div className={"relative w-full overflow-hidden"} style={{ height: `calc(100% - ${headerSize}px)` }}>
                <div className="">
                    {loading && !hasError && (
                        <Loading />
                    )}
                    {!loading && !hasError && (
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden ring-1 ring-black ring-opacity-5">
                                <table className="min-w-full">
                                    <thead className="bg-highlight text-white">
                                        <tr>
                                            {data && data.length > 0 && Object.keys(data[0]).map((key) => (
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6" key={key}>
                                                    {key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white [&>*:nth-child(odd)]:bg-gray-50">
                                        {data && data.length > 0 && data.slice(0,5).map((row, index) => (
                                            <tr key={index}>
                                                {Object.keys(row).map((key) => (
                                                    <td className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" key={key}>
                                                        {row[key]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
					{!loading && hasError && (
						<ChartError />
					)}
                </div>
            </div>
        </div>
    )
}
