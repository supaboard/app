"use client"

import { useSelectedLayoutSegment, usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"


export function SegmentSidebar({ children }) {
	const segment = useSelectedLayoutSegment()
	const [loading, setLoading] = useState(false)
	const [segments, setSegments] = useState([])

	useEffect(() => {
		const getSegment = async () => {
			setLoading(true)
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/contacts/segments`)
			const data = await res.json()
			setSegments(data)
			setLoading(false)
		}

		getSegment()
	}, [])

	return (
		<div className="flex flex-col h-[calc(100vh_-_70px)] border-r border-gray-200 p-8">
			<h2 className="font-black">All segments</h2>
			{!segments || segments.length === 0 && (
				<div className="mt-8">
					<div className="relative mx-auto block w-full rounded border border-dashed bg-gray-50 border-gray-300 p-6 text-center">
						<span className="mt-6 block text-sm text-gray-500 mx-auto">
							You don&apos;t have any segments yet. <br /> Create a segment to get started.
						</span>
						<Link href="/segments/create">
							<button className=" btn-default mt-6">
								Create a segment
							</button>
						</Link>
					</div>
				</div>
			)}
			{!loading && segments.length != 0 && (
				<div className="mt-8">
					{segments.map((seg) => (
						<Link href={`/segments/${seg.uuid}`} key={seg.uuid}>
							<span className={`block py-2 px-4 rounded-lg ${segment === seg?.uuid ? "bg-gray-100" : ""}`}>
								{seg.name}
							</span>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}
