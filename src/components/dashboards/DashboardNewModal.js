"use client"

import { useState } from "react"
import Modal from "@/components/util/Modal"
import { createDashboard } from "@/app/(app)/dashboards/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import useStore from "@/store/index"
import { can } from "@/lib/auth"
import Loading from "../Loading"


export function DashboardNewModal({ showModal, setShowModal }) {
	const router = useRouter()
	const { showUpgradeModal, setShowUpgradeModal } = useStore()
	const [loading, setLoading] = useState(false)

	const checkCreateAllowed = async (e) => {
		e.preventDefault()
		setLoading(true)

		const allowed = await can("create:dashboard")
		if (!allowed) {
			setLoading(false)
			setShowModal(false)
			setShowUpgradeModal("create:dashboard")
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
						<b className="text-xl font-black">Create a dashboard</b>
					</div>
					<form
						action={async (data) =>
							createDashboard(data)
								.then((res) => {
									setShowModal(false)
									toast.success("Dashboard created!")
									router.push(`/dashboards/${res.uuid}`)
									router.refresh()
								})
								.catch((err) => toast.error(err.message))
						}
						className="rounded-b-lg bg-white"
					>
						<div className="p-6">
							<div className="mt-3">
								<label htmlFor="dashboard_name">Dashboard name</label>
								<input type="text" name="dashboard_name" id="dashboard_name" className="form-input" placeholder="Dashboard name" />
							</div>
							<div className="mt-6">
								<label htmlFor="name">Default timeframe</label>
								<select name="timeframe" id="timeframe" className="form-input">
									<option value="last_7_days">Last 7 days</option>
									<option value="last_30_days">Last 30 days</option>
									<option value="last_90_days">Last 90 days</option>
									<option value="last_365_days">Last 365 days</option>
								</select>
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
										Create dashboard
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
