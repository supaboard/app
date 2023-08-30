"use server"

import Loading from "@/components/Loading"
import { LockClosedIcon } from "@heroicons/react/24/outline"


export default async function LoadingEditDatabase({ params }) {
	return (
		<>
			<div className="py-8 p-8">
				<div className="mt-4">
					<div className="bg-gray-50 rounded border border-gray-200 p-12 shadow-inner">

						<div className="max-w-lg mx-auto block cursor-pointer text-left m-0 bg-white border border-gray-200 rounded-lg shadow-sm drop-shadow-lg h-full">
							<div className="p-4 bg-gray-50 border-b border-gray-200 rounded-t-lg">
								<h2 className="text-xl font-black">
									Database connection details
								</h2>
							</div>
							<div className="relative pointer-events-none p-4">

								<div className="absolute z-40 max-w-xl mx-auto block text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
									<div className="w-14 h-14 bg-dark border-4 border-highlight rounded-lg -rotate-6 relative mx-auto shadow-xl drop-shadow-lg">
										<LockClosedIcon className="w-6 h-6 mx-auto text-highlight mt-3" />
									</div>
									<div className="mt-6">
										<span className="font-semibold block text-sm text-gray-500 mx-auto">
											Decrypting connection details...
										</span>
									</div>
								</div>
								<div className="blur-sm">

									<div className="mt-8">
										<label htmlFor="name">
											Connection Name
										</label>
										<input
											type="text"
											name="name"
											id="name"
											className="form-input"
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
										/>
									</div>
								</div>
							</div>
							<div className="flex blur-sm items-center mt-6 bg-50 border-t border-gray-200 p-4">
								<div className="grow">
									<div className="inline-block cursor-pointer text-gray-400 border border-gray-200 rounded py-1 px-3">
										<div>
											Cancel
										</div>
									</div>
								</div>
								<button className="btn-default">
									Save connection details
								</button>
							</div>
						</div>

					</div>
				</div>
			</div>
		</>
	)
}
