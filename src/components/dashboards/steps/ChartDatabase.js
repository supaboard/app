"use client"

import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useEffect, useState } from "react"

export function ChartDatabase({ activeStep, setActiveStep, databases, setDatabase, cancelUrl }) {

	return (
		<div className="max-w-lg mx-auto block cursor-pointer text-left m-0 bg-white border border-gray-200 rounded-lg shadow-sm drop-shadow-lg h-full">
			<div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
				<b className="text-xl font-black">Database connection</b>
			</div>
			{(!databases || databases.length == 0) && (
				<div className="p-6">
					<p className="text-gray-500">
						You don&apos;t have any databases connected to your account. Please connect a database to continue.
					</p>
					<Link href="/databases" className="btn-default inline-flex items-center mt-4">
						Connect a database <ArrowUpRightIcon className="h-3 w-3 ml-2" />
					</Link>
				</div>
			)}
			{databases && databases.length > 0 && (
				<>
					<div className="mt-2 p-4">
						<label htmlFor="name">
							Database
						</label>
						<select
							className="form-input"
							defaultValue={databases[0]?.uuid}
							onChange={(e) => {
								setDatabase(e.target.value)
							}}
						>
							{databases.map((database) => (
								<option key={database.id} value={database.uuid}>
									{database.name}
								</option>
							))}
						</select>
					</div>
					<div className="flex gap-x-4 mt-10 place-content-end bg-gray-50 rounded-b-lg border-t border-gray-200 py-3 px-6">
						<div className="grow text-left">
							{cancelUrl && (
								<Link
								className="btn-secondary inline-block"
								href={cancelUrl}
							>
								Cancel
							</Link>
							)}
							{!cancelUrl && (
							<button
								className="btn-secondary flex items-center grow"
								onClick={() => {
									setActiveStep(activeStep - 1)
								}}
							>
								<ArrowLeftIcon className="h-4 w-4 mr-2" />
								Back
							</button>
							)}
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
				</>
			)}
		</div>
	)
}
