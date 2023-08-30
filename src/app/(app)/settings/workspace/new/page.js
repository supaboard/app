"use server"

import { redirect } from "next/navigation"
import { createWorkspace } from "./actions"

export default async function NewWorkspace() {

	return (
		<>
			<p className="text-gray-400">
				Create a new workspace
			</p>

			<div className="border border-gray-200 divide-y divide-gray-200 max-w-xl mt-4">
				<div className="p-4 py-2 bg-gray-50">
					<span className="text-left text-sm font-semibold text-gray-900">
						Workspace name
					</span>
				</div>
				<div className="p-4">
					<form action={createWorkspace}>
						<input type="text" name="name" id="name" className="form-input" />
						<div className="flex place-content-end">
							<button
								className="btn btn-default !text-sm mt-4"
								type="submit"
							>
								Create workspace
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}
