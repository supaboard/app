"use client"

import Modal from "@/components/util/Modal"
import { toast } from "sonner"
import { useRouter, redirect } from "next/navigation"
import { deleteDatabase } from "@/app/(app)/databases/actions"

export function DatabaseDeleteModal({ database, showModal, setShowModal }) {
	const router = useRouter()

	return (
		<>
			<Modal
				showModal={true}
				onClose={() => router.push(`/databases/${database.uuid}`)}
			>
				<div>
					<div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
						<b className="text-xl font-black">Really delete this database connection?</b>
					</div>
					<form
						action={async () =>
							deleteDatabase(database)
								.then(async (res) => {
									toast.success("Database deleted!")
									router.push("/databases")
									router.refresh()
								})
								.catch((err) => toast.error(err.message))
						}
						className="rounded-b-lg bg-white"
					>
						<div className="p-6">
							<p>
								Are you sure you want to delete the database &quot;<b>{database?.name}</b>&quot;?
								This cannot be undone. We do not &apos;soft-delete&apos; database connections.
							</p>
							<p className="mt-2">
								<i><u>If you delete this connection, all charts that rely on it will fail to load</u></i>.
							</p>
						</div>
						<div className="flex gap-x-4 mt-4 place-content-end bg-gray-50 rounded-b-lg border-t border-gray-200 py-3 px-6">
							<div
								className="btn-secondary cursor-pointer"
								onClick={() => router.push(`/databases/${database.uuid}`)}
							>
								Cancel
							</div>
							<button className="btn-default">Delete database</button>
						</div>
					</form>
				</div>
			</Modal>
		</>
	)
}
