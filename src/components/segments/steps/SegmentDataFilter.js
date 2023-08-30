
"use client"

import { RadioGroup } from "@headlessui/react"
import { TrashIcon } from "@heroicons/react/24/outline"

export function SegmentDataFilter({ externalDb, filters, setFilters, filterType, selectedTable, setSelectedTable, setFilterType, contacts, reduced }) {

	return (
		<>
			{!reduced && (
			<div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
				<b className="text-xl font-black">Configure data driven segment</b>
			</div>
			)}
			<div className={`mt-4 ${reduced ? "" : "p-6"}`}>
				<label>Filter type</label>
				<div className="w-40">
					<RadioGroup
						value={filterType}
						onChange={setFilterType}
						className="grid grid-cols-2 gap-x-1 rounded-lg p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
					>
						<RadioGroup.Label className="sr-only">Filter type</RadioGroup.Label>
						<RadioGroup.Option
							key="simple"
							value="simple"
							className={`cursor-pointer rounded-md px-2.5 py-1 ${filterType == "simple" ? "bg-highlight text-white" : "text-gray-500"}`}
						>
							<span>Simple</span>
						</RadioGroup.Option>
						<RadioGroup.Option
							key="advanced"
							value="advanced"
							className={`cursor-pointer rounded-md px-2.5 py-1 ${filterType == "advanced" ? "bg-highlight text-white" : "text-gray-500"}`}
						>
							<span>Advanced</span>
						</RadioGroup.Option>
					</RadioGroup>
				</div>

				<div className="mt-8">
					{filterType == "advanced" && (
						<>
							<label>Filter Query</label>
							<p className="text-xs text-gray-400">
								Enter a Postgres query to filter your contacts. You can use any kinds of JOINS, WHERE clauses etc. as long as the query returns a list of your contacts and needed columns.
							</p>
							<textarea
								className="form-input mt-2"
								placeholder="Enter a filter query"
								rows={5}
								value={filters.query || ""}
								onChange={(e) => {
									setFilters({
										...filters,
										query: e.target.value
									})
								}}
							/>
						</>
					)}
					{filterType == "simple" && (
						<>
							<label>Table</label>
							<select
								className="form-input mb-4"
								onChange={(e) => {
									setSelectedTable(e.target.value)
								}}
								value={selectedTable}
							>
								<option value="">Select a table</option>
								{externalDb?.map((table, index) => (
									<option value={table.name} key={index}>{table.name}</option>
								))}
							</select>

							<label className="mt-8">Filters</label>
							{filters.map((filter, filterIndex) => (
								<div key={filterIndex}>
									{filter.id != 1 && (
										<div className="w-32 !inline-block my-2">
											<select
												className="form-input"
												onChange={(e) => {
													let newFilters = [...filters]
													setFilters(
														newFilters.map((f) => {
															if (f.id == filter.id) {
																f.comparator = e.target.value || "and"
															}
															return f
														})
													)
												}}
												defaultValue="and"
											>
												<option value="and">AND</option>
												<option value="or">OR</option>
											</select>
										</div>
									)}

									<div className="flex items-center gap-x-3 mt-1 my-2 bg-gray-100 p-2 rounded" key={filter.id}>
										<select
											className="form-input"
											onChange={(e) => {
												let newFilters = [...filters]
												setFilters(
													newFilters.map((f) => {
														if (f.id == filter.id) {
															f.attribute = e.target.value
														}
														return f
													})
												)
											}}
											value={filter.attribute}
										>
											<option value="">Select an attribute</option>
											{externalDb?.find((table) => table.name == selectedTable)?.columns.map((column, index) => (
												<option value={column.name} key={index}>{column.name}</option>
											))}
										</select>
										<select
											className="form-input"
											onChange={(e) => {
												let newFilters = [...filters]
												setFilters(
													newFilters.map((f) => {
														if (f.id == filter.id) {
															f.operator = e.target.value
														}
														return f
													})
												)
											}}
											value={filter.operator || "eq"}
										>
											<option value="eq">=</option>
											<option value="neq">!=</option>
											<option value="gt">&gt;</option>
											<option value="lt">&lt;</option>
											<option value="is">IS</option>
											<option value="isnot">IS NOT</option>
										</select>
										<input
											type="text"
											name="name"
											id="name"
											className="form-input"
											placeholder="Value"
											defaultValue={filter.value}
											onChange={(e) => {
												let newFilters = [...filters]
												setFilters(
													newFilters.map((f) => {
														if (f.id == filter.id) {
															f.value = e.target.value
														}
														return f
													})
												)
											}}
										/>
										{filter.id != 1 && (
											<button
												className="btn-default flex items-center float-right"
												onClick={() => {
													setFilters(
														filters.filter((f) => {
															return f.id != filter.id
														}
														))
												}}
											>
												<TrashIcon className="h-4 w-4" />
											</button>
										)}
										{filter.id == 1 && (
											<div className="w-52"></div>
										)}
									</div>
								</div>
							))}
							<button
								className="btn-secondary w-full place-content-center flex items-center mt-8 !border-gray-400 border-dashed text-gray-400"
								onClick={() => {
									setFilters([
										...filters,
										{
											id: Math.floor(Math.random() * 1000),
											attribute: "",
											operator: "",
											comparator: "and",
											value: ""
										}
									])
								}}
							>
								+ Add filter
							</button>
						</>
					)}
				</div>
			</div>
		</>
	)
}
