"use client"

import { useEffect, useRef, useState } from "react"
import { NodeResizer } from "reactflow"
import store from "@/store"

import { ChartError } from "@/components/dashboards/charts/ChartError"
import Loading from "@/components/Loading"

export default function TableNode({ data, children }) {
	const [loading, setLoading] = useState(false)
	const [hasError, setHasError] = useState(false)

	return (
		<>
			<div className={"relative w-full overflow-hidden h-full"}>
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
										{data && data.length > 0 && data.slice(0, 5).map((row, index) => (
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
		</>
	)
}
