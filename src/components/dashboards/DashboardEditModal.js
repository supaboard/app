"use client"

import Modal from "@/components/util/Modal"
import { updateDashboard } from "@/app/(app)/dashboards/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function DashboardEditModal({ dashboard, showModal, setShowModal, setUpdateHash }) {
    const router = useRouter()

    return (
        <>
            <Modal
                showModal={showModal}
                onClose={() => setShowModal(false)}
            >
                <div>
                    <div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
                        <b className="text-xl font-black">Edit this dashboard</b>
                    </div>
                    <form
                        action={async (data) => {
                            let updates = {
                                ...dashboard,
                                name: data.get("name"),
                                config: {
                                    ...dashboard.config,
                                    timeframe: data.get("timeframe")
                                }
                            }

                            updateDashboard(updates)
                                .then(async (res) => {
                                    setShowModal(false)
                                    toast.success("Dashboard saved!")
                                    setUpdateHash(Math.random())
                                    router.push(`/dashboards/${dashboard.uuid}`)
                                    router.refresh()
                                })
                                .catch((err) => toast.error(err.message))
                            }
                        }
                        className="rounded-b-lg bg-white"
                    >
                        <div className="p-6">
                            <div className="mt-3">
                                <label htmlFor="name">Dashboard name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="form-input"
                                    placeholder="Dashboard name"
                                    defaultValue={dashboard?.name}
                                />
                                <div className="mt-6">
                                <label htmlFor="name">Default timeframe</label>
                                <select name="timeframe" id="timeframe" className="form-input" defaultValue={dashboard?.timeframe || "last_7_dyas"}>
                                    <option value="last_7_days">Last 7 days</option>
                                    <option value="last_30_days">Last 30 days</option>
                                    <option value="last_90_days">Last 90 days</option>
                                    <option value="last_365_days">Last 365 days</option>
                                </select>
                            </div>
                            </div>
                        </div>
                        <div className="flex gap-x-4 mt-10 place-content-end bg-gray-50 rounded-b-lg border-t border-gray-200 py-3 px-6">
                            <button
                                className="btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button className="btn-default">Save dashboard</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}
