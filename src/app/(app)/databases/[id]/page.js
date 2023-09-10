"use server"

import { cookies } from "next/headers"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { updateDatabase, deleteDatabase } from "../actions"
import { decrypt } from "@/lib/crypto"
import Link from "next/link"
import { DatabaseDeleteModal } from "@/components/databases/DatabaseDeleteModal"

async function getData(id) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/databases/${id}`, {
		headers: { Cookie: cookies().toString() }
	})
	if (!res.ok) {
		throw new Error("Failed to fetch data")
	}

	return res.json()
}

export default async function EditDatabase({ params, searchParams }) {
	const { id, } = params
	const { confirmdelete } = searchParams
	const database = await getData(id)

	let connection = decrypt(database.connection)
	if (connection) {
		connection = JSON.parse(connection)
	}

	return (
		<>
			<div className="py-8 p-8">
				<div className="mt-4">
					<div className="bg-gray-50 rounded border border-gray-200 p-12 shadow-inner">

						<form action={updateDatabase}>
							<input type="hidden" name="uuid" value={id} />
							<div className="max-w-lg mx-auto block cursor-pointer text-left m-0 bg-white border border-gray-200 rounded-lg shadow-sm drop-shadow-lg h-full">
								<div className="p-4 bg-gray-50 border-b border-gray-200 rounded-t-lg">
									<h2 className="text-xl font-black">
										Database connection details
									</h2>
								</div>
								<div className="p-4">
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
											defaultValue={database.name}
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
											defaultValue={connection.host}
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
											defaultValue={connection.port}
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
											defaultValue={connection.user}
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
											defaultValue={connection.password}
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
											defaultValue={connection.database}
										/>
									</div>
								</div>
								<div className="flex items-center mt-6 bg-50 border-t border-gray-200 p-4">
									<div className="grow">
										<div className="inline-block cursor-pointer text-gray-400 border border-gray-200 rounded py-1 px-3">
											<Link href="/databases">
												Cancel
											</Link>
										</div>
									</div>
									<button className="btn-default">
										Save connection details
									</button>
								</div>
							</div>
						</form>
						<div className="max-w-lg mx-auto mt-6">
							<Link href={`/databases/${id}/?confirmdelete=true`} className="w-full place-content-center bg-white flex items-center gap-x-2 rounded py-1 px-3 border border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-colors">
								<ExclamationTriangleIcon className="w-4 h-4" />
								<span>Delete this database connection</span>
							</Link>
						</div>
					</div>
				</div>

				{confirmdelete && (
					<DatabaseDeleteModal database={database} />
				)}
			</div>


		</>
	)
}
