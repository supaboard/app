"use client"

import { ArrowLeftIcon } from "@heroicons/react/24/outline"

export function DatabaseDetails({ databaseType, databaseDetails, setDatabaseDetails, activeStep, setActiveStep, createNewDatabase }) {
	return (
		<div className="max-w-lg mx-auto block cursor-pointer text-left m-0 bg-white border border-gray-200 rounded-lg shadow-sm drop-shadow-lg h-full">
			<div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
				<b className="text-xl font-black">Database connection details</b>
			</div>
			<div className="px-6">
				<div className="mt-8">
					<label htmlFor="name">
						Connection Name
					</label>
					<input
						type="text"
						name="name"
						id="name"
						className="form-input"
						placeholder="Enter to identify this connection..."
						onChange={(e) => {
							setDatabaseDetails({
								...databaseDetails,
								name: e.target.value
							})
						}}
					/>
				</div>
				<div className="mt-8">
					<label htmlFor="host">
						Host
					</label>
					<input
						name="host"
						id="host"
						className="form-input"
						onChange={(e) => {
							setDatabaseDetails({
								...databaseDetails,
								host: e.target.value
							})
						}}
					/>
				</div>
				<div className="mt-4">
					<label htmlFor="port">
						Port
					</label>
					<input
						name="port"
						id="port"
						type="number"
						className="form-input"
						onChange={(e) => {
							setDatabaseDetails({
								...databaseDetails,
								port: e.target.value
							})
						}}
					/>
				</div>
				<div className="mt-4">
					<label htmlFor="user">
						User
					</label>
					<input
						name="user"
						id="user"
						className="form-input"
						autoComplete="supaboard-user"
						onChange={(e) => {
							setDatabaseDetails({
								...databaseDetails,
								user: e.target.value
							})
						}}
					/>
				</div>
				<div className="mt-4">
					<label htmlFor="password">
						Password
					</label>
					<input
						name="password"
						id="password"
						type="password"
						autoComplete="supaboard-pw"
						className="form-input"
						onChange={(e) => {
							setDatabaseDetails({
								...databaseDetails,
								password: e.target.value
							})
						}}
					/>
				</div>
				<div className="mt-4">
					<label htmlFor="database">
						Database
					</label>
					<input
						name="database"
						id="database"
						className="form-input"
						onChange={(e) => {
							setDatabaseDetails({
								...databaseDetails,
								database: e.target.value
							})
						}}
					/>
				</div>
			</div>
			<div className="flex gap-x-4 mt-10 place-content-end bg-gray-50 rounded-b-lg border-t border-gray-200 py-3 px-6">
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
						className={`btn-default flex items-center float-right
							${databaseDetails?.name && databaseDetails?.host && databaseDetails?.port && databaseDetails?.user && databaseDetails?.password && databaseDetails?.database ? "opacity-100" : "opacity-50"}
						`}
						onClick={() => {
							createNewDatabase()
						}}
						disabled={!databaseDetails?.name || !databaseDetails?.host || !databaseDetails?.port || !databaseDetails?.user || !databaseDetails?.password || !databaseDetails?.database}
					>
						Save Database
					</button>
				</div>
			</div>

		</div>
	)
}
