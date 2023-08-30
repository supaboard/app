"use client"

import { ArrowLeftIcon, ArrowRightIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline"
import { RadioGroup } from "@headlessui/react"

const chartTypes = [
	{
		name: "area",
		required: ["data", "time"],
		description: "Area charts are used to represent quantitative data over time. They are useful for emphasizing the magnitude of change over time.",
	},
	{
		name: "counter",
		required: ["data"],
		description: "Counter charts are simple and used to represent quantitative data.",
	},
	{
		name: "bar",
		required: ["data", "time"],
		description: "Bar charts are used to represent quantitative data over time. They are useful for emphasizing the magnitude of change over time.",
	},
	{
		name: "pie",
		required: ["data"],
		description: "Pie charts are used to represent mutliple data points as a percentage of the whole.",
	},
	{
		name: "table",
		required: ["data", "time"],
		description: "Tables are great to show a lot of data in a small space. They are useful for comparing data points side by side.",
	}
]


export function ChartDataTable({ chart, chartType, chartData, filterType, setFilterType, selectedDataTable, setSelectedDataTable, selectedDataColumn, setSelectedDataColumn, selectedTimeTable, setSelectedTimeTable, selectedTimeColumn, setSelectedTimeColumn, filters, setFilters, activeStep, setActiveStep, reduced }) {

	const changeFilterType = (value) => {
		if (value === "simple") {
			setFilters([])
		} else {
			setFilters({
				query: chart?.filters?.query
			})
		}
		setFilterType(value)
	}

	return (
		<div className="max-w-2xl mx-auto block text-left m-0 bg-white border border-gray-200 rounded-lg h-full">
			{!reduced && (
				<div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
					<b className="text-xl font-black">Select the data to display in your chart</b>
					<p className="text-gray-500 text-sm mt-1">
						{chartTypes.find((type) => type.name == chartType).description}
					</p>
				</div>
			)}
			<div className="p-4">
				<label>Filter type</label>
				<div className="w-40">
					<RadioGroup
						value={filterType}
						onChange={changeFilterType}
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
								Please specify the data point (x) and timeframe (y) columns from the result, which we should use for the chart below.
							</p>
							<textarea
								className="form-input mt-3"
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
							<div className="flex gap-8 mt-6">
								<div>
									<label className="whitespace-nowrap">Data point (x)</label>
									<input
										type="text"
										className="form-input mt-2"
										placeholder="Enter a column name"
										defaultValue={selectedDataColumn}
										onChange={(e) => {
											setSelectedDataColumn(e.target.value)
										}}
									/>
								</div>
								<div>
									<label className="whitespace-nowrap">Timeframe (y)</label>
									<input
										type="text"
										className="form-input mt-2"
										placeholder="Enter a column name"
										defaultValue={selectedTimeColumn}
										onChange={(e) => {
											setSelectedTimeColumn(e.target.value)
										}}
									/>
								</div>
							</div>
						</>
					)}

					{filterType == "simple" && (
						<>
							<div className="flex items-center gap-x-8 mt-12 relative z-20">
								<div>
									<label className="grow whitespace-nowrap w-40 shrink-0">Data point (x)</label>
									<select
										className="form-input mt-2"
										value={selectedDataTable}
										onChange={(e) => {
											setSelectedDataTable(e.target.value)
											setSelectedTimeTable(e.target.value)
										}}
									>
										{chartData?.map((table) => (
											<option key={table.name}>{table.name}</option>
										))}
									</select>
								</div>
								<span>
									<ChevronRightIcon className="w-4 h-4 mt-6" />
								</span>
								<select
									className="form-input mt-6"
									defaultValue={selectedDataColumn}
									onChange={(e) => {
										setSelectedDataColumn(e.target.value)
									}}
								>
									{selectedDataTable && (
										<>
											{chartData?.find((table) => table.name == selectedDataTable)?.columns.map((column) => (
												<option key={column.name}>{column.name}</option>
											))}
										</>
									)}
								</select>
							</div>

							<div className="text-center relative z-10">
								<div className="absolute m-auto left-6 top-3 w-0 p-0 h-6 border-r-2 border-l-0 border-dashed border-gray-200" aria-hidden="true" />
							</div>

							<div className="flex items-center gap-x-8 mt-10 relative z-20">
								<div>
									<label className="grow whitespace-nowrap w-40 shrink-0">Timeframe (y)</label>
									<select
										disabled={true}
										className="form-input mt-2"
										onChange={(e) => {
											setSelectedTimeTable(e.target.value)
										}}
										value={selectedDataTable}
									>
										{chartData?.map((table) => (
											<option key={table.name}>{table.name}</option>
										))}
									</select>
								</div>
								<span>
									<ChevronRightIcon className="w-4 h-4 mt-6" />
								</span>
								<select
									className="form-input mt-6"
									defaultValue={selectedTimeColumn}
									onChange={(e) => {
										setSelectedTimeColumn(e.target.value)
									}}
								>
									{selectedTimeTable && (
										<>
											{chartData?.find((table) => table.name == selectedDataTable)?.columns.map((column) => (
												<option key={column.name}>{column.name}</option>
											))}
										</>
									)}
								</select>
							</div>

							<div className="text-center relative z-10">
								<div className="absolute m-auto left-6 top-2 w-0 p-0 h-12 border-r-2 border-l-0 border-dashed border-gray-200" aria-hidden="true" />
							</div>


							<label className="mt-16">Filters (WHERE)</label>
							{filters.map((filter, filterIndex) => (
								<div key={filterIndex}>
									{filterIndex != 0 && (
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
											{chartData?.find((table) => table.name == selectedDataTable)?.columns.map((column, index) => (
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

			{!reduced && (
				<div className="flex gap-x-4 mt-10 place-content-end bg-gray-50 rounded-b-lg border-t border-gray-200 py-3 px-6">
					<div className="grow text-left">
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
							className="btn-default flex items-center"
							onClick={() => {
								setActiveStep(activeStep + 1)
							}}
						>
							Next
							<ArrowRightIcon className="h-4 w-4 ml-2" />
						</button>
					</div>
				</div>
			)}

		</div>

	)
}
