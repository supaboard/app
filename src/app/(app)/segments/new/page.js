"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon, TrashIcon } from "@heroicons/react/24/outline"
import { can } from "@/lib/auth"
import useStore from "@/store/index"
import { SegmentDataFilter } from "@/components/segments/steps/SegmentDataFilter"
import { createSegment } from "../actions"


export default function NewSegment() {
	const router = useRouter()
	const { showUpgradeModal, setShowUpgradeModal } = useStore()
	let [isPending, startTransition] = useTransition()
	const [activeStep, setActiveStep] = useState(1)

	const [name, setName] = useState(null)
	const [externalDb, setExternalDb] = useState(null)
	const [selectedTable, setSelectedTable] = useState(null)
	const [segmentType, setSegmentType] = useState("data")
	const [filterType, setFilterType] = useState("simple")
	const [filters, setFilters] = useState([{
		id: 1,
		attribute: null,
		operator: null,
		value: null,
	}])

	const [contacts, setContacts] = useState([])

	useEffect(() => {
		const checkCreateAllowed = async () => {
			const allowed = await can("create:segment")
			if (!allowed) {
				setShowUpgradeModal("create:segment")
			}
		}

		const getSegment = async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/contacts`)
			const data = await res.json()
			setContacts(data)

			const dbRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/externaldb/${data.database}`)
			const dbData = await dbRes.json()
			setExternalDb(dbData)
		}

		checkCreateAllowed()
		getSegment()
	}, [])


	const createNewSegment = async () => {
		let segment = {
			name: name,
			database: contacts.database,
			config: {
				table: selectedTable,
				type: segmentType,
				filterType: filterType,
				filters: filters,
			}
		}

		startTransition(() => createSegment(segment))
		if (!isPending) {
			router.push("/segments")
		}
	}

	return (
		<>
			<div className="flex items-center border-b border-gray-200 divide-x divide-gray-200 font-semibold text-sm">
				<div className={`flex items-center place-content-center gap-x-2 grow text-center p-4 ${activeStep == 1 ? "opacity-100 bg-gray-50" : "opacity-25"}`}>
					<div className="bg-highlight text-white rounded w-6 h-6 pt-0.5">1</div>
					<span>Choose segment type</span>
				</div>
				<div className={`flex items-center place-content-center gap-x-2 grow text-center p-4 ${activeStep == 2 ? "opacity-100 bg-gray-50" : "opacity-25"}`}>
					<div className="bg-highlight text-white rounded w-6 h-6 pt-0.5">2</div>
					<span>Set up segment filters</span>
				</div>
			</div>
			<div className="py-8 p-8">
				<div className="mt-4">

					{activeStep == 1 && (
						<>
							<div className="bg-white max-w-lg mx-auto rounded-lg border border-gray-200">
								<div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
									<b className="text-xl font-black">Create a new segment</b>
								</div>
								<div className="mt-4 p-6">
									<label>Segment Name</label>
									<input
										type="text"
										name="name"
										id="name"
										className="form-input"
										placeholder="Name this segment"
										onChange={(e) => setName(e.target.value)}
									/>

									{/* <label className="mt-6">Segment type</label>
									<p className="text-gray-500 text-sm">
										You can create a segment based on conditions and data from your database or manually add users to a segment.
									</p>
									<select
										className="form-input mt-2"
										onChange={(e) => setSegmentType(e.target.value)}
									>
										<option value="data">Data driven segment</option>
										<option value="manual">Manual segment</option>
									</select> */}
								</div>
								<div className="flex items-center mt-4 bg-gray-50 border-t border-gray-200 rounded-b-lg py-3 px-6">
									<div className="text-left">
										<Link href="/databases" className="btn-secondary flex items-center grow" >
											Cancel
										</Link>
									</div>
									<div className="flex grow place-content-end">
										<button
											className="btn-default flex items-center float-right"
											onClick={() => {
												setActiveStep(activeStep + 1)
											}}
										>
											Next
											<ArrowRightIcon className="h-4 w-4 ml-2" />
										</button>
									</div>
								</div>
							</div>
						</>
					)}
					{activeStep == 2 && (
						<div className="bg-white max-w-2xl mx-auto rounded-lg border border-gray-200">
							<SegmentDataFilter
								externalDb={externalDb}
								filters={filters}
								selectedTable={selectedTable}
								setSelectedTable={setSelectedTable}
								setFilters={setFilters}
								filterType={filterType}
								setFilterType={setFilterType}
								contacts={contacts}
							/>
							<div className="flex items-center mt-4 bg-gray-50 border-t border-gray-200 rounded-b-lg py-3 px-6">
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
											createNewSegment()
										}}
									>
										Save Segment
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	)
}
