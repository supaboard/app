"use client"

import { ArrowLeftIcon } from "@heroicons/react/24/outline"

export function ChartOptions({ chartType, options, setOptions, saveChart, activeStep, setActiveStep }) {
	return (
		<div className="max-w-2xl mx-auto block text-left m-0 bg-white border border-gray-200 rounded-lg h-full">
			<div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
				<b className="text-xl font-black">Chart options</b>
			</div>
			<div className="p-4">
				<div className="mt-8">
					<label htmlFor="name">
						Chart Name
					</label>
					<input
						type="text"
						name="name"
						id="name"
						className="form-input"
						placeholder="Enter a name for your chart"
						onChange={(e) => {
							setOptions({
								...options,
								name: e.target.value
							})
						}}
					/>
				</div>
				<div className="mt-8">
					<label htmlFor="description">
						Description
					</label>
					<textarea
						name="description"
						id="description"
						className="form-input"
						placeholder="Helpful info about what the chart does for you and your team"
						onChange={(e) => {
							setOptions({
								...options,
								description: e.target.value
							})
						}}
					/>
				</div>
			</div>
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
						className={`btn-default flex items-center ${options.name ? "" : "opacity-50"}`}
						onClick={() => {
							saveChart()
						}}
						disabled={!options.name}
					>
						Save chart
					</button>
				</div>
			</div>
		</div>
	)
}
