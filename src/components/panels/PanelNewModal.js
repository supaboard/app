"use client"

import { useState } from "react"
import Modal from "@/components/util/Modal"
import { createPanel } from "@/app/(app)/panels/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import useStore from "@/store/index"
import { can } from "@/lib/auth"
import Loading from "../Loading"


export function PanelNewModal({ showModal, setShowModal }) {
	const router = useRouter()
	const { showUpgradeModal, setShowUpgradeModal } = useStore()
	const [loading, setLoading] = useState(false)

	const checkCreateAllowed = async (e) => {
		e.preventDefault()
		setLoading(true)

		const allowed = await can("create:panel")
		if (!allowed) {
			setLoading(false)
			setShowModal(false)
			setShowUpgradeModal("create:panel")
		} else {
			e.target.form.requestSubmit()
		}
	}

	return (
		<>
			<Modal
				showModal={showModal}
				onClose={() => setShowModal(false)}
			>
				<div>
					<div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
						<b className="text-xl font-black">Create a panel</b>
					</div>
					<form
						action={async (data) =>
							createPanel(data)
								.then((res) => {
									setShowModal(false)
									toast.success("Panel created!")
									router.push(`/panels/${res.uuid}`)
									router.refresh()
								})
								.catch((err) => toast.error(err.message))
						}
						className="rounded-b-lg bg-white"
					>
						<div className="p-6">
							<div className="mt-3">
								<label htmlFor="panel_name">Panel name</label>
								<input type="text" name="panel_name" id="panel_name" className="form-input" placeholder="Panel name" />
							</div>
						</div>
						<div className="flex gap-x-4 mt-10 place-content-end bg-gray-50 rounded-b-lg border-t border-gray-200 py-3 px-6">
							<button
								className="btn-secondary"
								type="button"
								onClick={() => setShowModal(false)}
							>
								Cancel
							</button>
							<button
								className={`btn-default w-[165px] ${loading ? "opacity-50" : ""}`}
								type="submit"
								disabled={loading}
								onClick={(e) => {
									checkCreateAllowed(e)
								}}
							>
								{loading && <Loading />}
								{!loading && (
									<>
										Create panel
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</Modal>
		</>
	)
}
