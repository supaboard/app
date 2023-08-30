"use client"

import { useEffect, useState } from "react"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Modal from "@/components/util/Modal"
import { updateSegment } from "@/app/(app)/segments/actions"
import { SegmentDataFilter } from "./steps/SegmentDataFilter"

export function SegmentEditModal({ segment, showModal, setShowModal }) {
	const router = useRouter()
	const [externalDb, setExternalDb] = useState(null)
	const [filters, setFilters] = useState(null)
	const [filterType, setFilterType] = useState(null)
	const [selectedTable, setSelectedTable] = useState(null)
	const [segmentType, setSegmentType] = useState(null)

	useEffect(() => {
		if (!segment) return
		setFilters(segment.config.filters)
		setFilterType(segment.config.filterType)
		setSelectedTable(segment.config.table)
		setSegmentType(segment.config.type)

		const getDb = async () => {
			const dbRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/externaldb/${segment.database}`)
			const dbData = await dbRes.json()
			setExternalDb(dbData)
		}

		getDb()
	}, [segment])


	return (
		<>
			<Modal
				showModal={showModal}
				onClose={() => setShowModal(false)}
			>
				<div>
					<div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
						<b className="text-xl font-black">Edit this segment</b>
					</div>
					<form
						action={async (data) => {
							let config = {
								table: selectedTable,
								type: segmentType,
								filterType: filterType,
								filters: filters,
							}

							let updates = {
								...segment,
								name: data.get("name"),
								config: config,
							}

							updateSegment(updates)
								.then(async (res) => {
									setShowModal(false)
									toast.success("Segment saved!")
									setUpdateHash(Math.random())
									router.push(`/segments/${segment.uuid}`)
									router.refresh()
								})
								.catch((err) => toast.error(err.message))
						}
						}
						className="rounded-b-lg bg-white"
					>
						<div className="p-6">
							<div className="mt-3">
								<label htmlFor="name">Segment name</label>
								<input
									type="text"
									name="name"
									id="name"
									className="form-input"
									placeholder="Segment name"
									defaultValue={segment?.name}
								/>
							</div>
							<div className="mt-6">
								<SegmentDataFilter
									externalDb={externalDb}
									filters={filters}
									setFilters={setFilters}
									filterType={filterType}
									selectedTable={selectedTable}
									setSelectedTable={setSelectedTable}
									setFilterType={setFilterType}
									reduced={true}
								/>
							</div>
						</div>
						<div className="flex gap-x-4 mt-10 place-content-end bg-gray-50 rounded-b-lg border-t border-gray-200 py-3 px-6">
							<button
								className="btn-secondary"
								onClick={() => setShowModal(false)}
							>
								Cancel
							</button>
							<button className="btn-default">Save segment</button>
						</div>
					</form>
				</div>
			</Modal>
		</>
	)
}
