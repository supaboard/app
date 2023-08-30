"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import { ChartDatabase } from "@/components/dashboards/steps/ChartDatabase"
import { SelectContacts } from "@/components/contacts/steps/SelectContacts"
import { createContactConnection } from "../action"
import Loading from "@/components/Loading"

export default function NewDatabase({ params }) {
	const router = useRouter()
	let [isPending, startTransition] = useTransition()
	const [activeStep, setActiveStep] = useState(1)
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(false)
	const [database, setDatabase] = useState(null)
	const [databases, setDatabases] = useState(null)
	const [selectedDataTable, setSelectedDataTable] = useState(null)
	const [attributes, setAttributes] = useState(null)


	useEffect(() => {
		const getDatabases = async () => {
			setLoading(true)
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/databases`)
			if (!res.ok) {
				throw new Error("Failed to fetch data")
			}

			let data = await res.json()
			if (!data || data.length == 0) {
				setDatabases([])
				setDatabase(null)
				setLoading(false)
				return
			}

			setDatabases(data)
			setDatabase(data[0].uuid)
			setLoading(false)
		}

		getDatabases()
	}, [])


	useEffect(() => {
		if (activeStep === 2) {
			const getChartData = async () => {
				const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/externaldb/${database}`)
				const data = await res.json()
				setData(data)
				setSelectedDataTable(data[0].name)
			}
			getChartData()
		}
	}, [activeStep, database])

	const createAllUsersSegment = async () => {
		let contactConnection = {
			name: "All Users",
			database: database,
			table_name: selectedDataTable,
			attributes: attributes,
		}

		startTransition(() => createContactConnection(contactConnection))
		if (!isPending) {
			router.push("/segments")
		}
	}


	return (
		<>
			<div className="flex items-center border-b border-gray-200 divide-x divide-gray-200 font-semibold text-sm">
				<div className={`flex items-center place-content-center gap-x-2 grow text-center p-4 ${activeStep == 1 ? "opacity-100 bg-gray-50" : "opacity-25"}`}>
					<div className="bg-highlight text-white rounded w-6 h-6 pt-0.5">1</div>
					<span>Choose a database</span>
				</div>
				<div className={`flex items-center place-content-center gap-x-2 grow text-center p-4 ${activeStep == 2 ? "opacity-100 bg-gray-50" : "opacity-25"}`}>
					<div className="bg-highlight text-white rounded w-6 h-6 pt-0.5">2</div>
					<span>Define user attributes</span>
				</div>
			</div>

			<div className="py-8 p-8">
				<div className="mt-4">
					{activeStep == 1 && (
						<>
							<div>
								{loading && (
									<Loading />
								)}
								{!loading && (
									<ChartDatabase
										databases={databases}
										setDatabase={setDatabase}
										activeStep={activeStep}
										setActiveStep={setActiveStep}
										cancelUrl="/segments"
									/>
								)}
							</div>
						</>
					)}

					{activeStep == 2 && (
						<>
							<div className="bg-gray-50 rounded border border-gray-200 p-12 shadow-inner">
								<SelectContacts
									database={database}
									data={data}
									selectedDataTable={selectedDataTable}
									setSelectedDataTable={setSelectedDataTable}
									attributes={attributes || []}
									setAttributes={setAttributes}
								/>
							</div>
							<div className="flex items-center mt-4">
								<div className="text-left">
									<button
										className="btn-secondary flex items-center grow"
										onClick={() => {
											setActiveStep(activeStep - 1)
										}}
									>
										<ArrowLeftIcon className="h-4 w-4 mr-2" />
										Back
									</button>
								</div>
								<div className="flex grow place-content-end">
									<button
										className="btn-default flex items-center float-right"
										onClick={() => {
											createAllUsersSegment()
										}}
									>
										Save contacts
										<ArrowRightIcon className="h-4 w-4 ml-2" />
									</button>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	)
}
