"use client"

import { useEffect, useState } from "react"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline"

export function SelectContacts({ data, selectedDataTable, setSelectedDataTable, selectedDataColumn, setSelectedDataColumn, attributes, setAttributes }) {
	const [expanded, setExpanded] = useState([])

	useEffect(() => {
		let attrs = []
		data?.find((table) => table.name == selectedDataTable)?.columns.map((column) => (
			attrs.push({
				identifier: column.name,
				name: column.name,
				type: column.type,
			})
		))

		setAttributes(attrs)
	}, [selectedDataTable])

	return (
		<div>
			<h2 className="text-xl font-black">
				Select where your users are stored and which attributes you want to use for segmentation
			</h2>
			<p className="text-gray-500 text-sm mt-2">
				You&apos;ll be able to filter your users by these attributes later on.
			</p>

			<div className="flex gap-x-8 mt-12 relative z-20">
				<div className="grow max-w-md">
					<label>Table</label>
					<select
						className="form-input mt-1"
						onChange={(e) => {
							setSelectedDataTable(e.target.value)
						}}
					>
						{data?.map((table) => (
							<option key={table.name}>{table.name}</option>
						))}
					</select>
				</div>
				<span className="mt-8">
					<ChevronRightIcon className="w-4 h-4" />
				</span>
				<div className="grow">
					<label>Attributes</label>

					{attributes?.map((attribute) => (
						<div className="flex items-center mt-1" key={attribute.name}>
							<input
								className="form-input"
								placeholder="Attribute name"
								value={attribute.name}
								onChange={(e) => {
									let attrs = [...attributes]
									attrs.find((attr) => attr.name == attribute.name).name = e.target.value
									setAttributes(attrs)
								}}
							/>
							<select
								className="form-input ml-2"
								value={attribute.type}
								onChange={(e) => {
									let attrs = [...attributes]
									attrs.find((attr) => attr.name == attribute.name).type = e.target.value
									setAttributes(attrs)
								}}
							>
								<option>string</option>
								<option>number</option>
								<option>boolean</option>
								<option>date</option>
							</select>
							<div className="ml-1">
								<TrashIcon className="w-4 h-4 ml-2 cursor-pointer" onClick={() => {
									setAttributes(attributes.filter((attr) => attr.name != attribute.name))
								}} />
							</div>
						</div>
					)
					)}
				</div>
			</div>
		</div>
	)
}
