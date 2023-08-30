"use client"

import { useState } from "react"
import { Switch } from "@headlessui/react"
import Modal from "@/components/util/Modal"
import { updateDashboard } from "@/app/(app)/dashboards/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function DashboardPublicModal({ dashboard, showModal, setShowModal, setUpdateHash }) {
    const router = useRouter()
    const [enabled, setEnabled] = useState(dashboard?.is_public || false)

    return (
        <>
            <Modal
                showModal={showModal}
                onClose={() => setShowModal(false)}
            >
                <div>
                    <div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
                        <b className="text-xl font-black">Share this dashboard</b>
                    </div>
                    <form
                        action={async (data) => {
                            let updates = {
                                ...dashboard,
                                is_public: enabled
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
                        }}
                        className="rounded-b-lg bg-white"
                    >
                        <div className="p-6">
                            <p>
                                Give public access to the dashboard <b>{dashboard?.name}</b> with this sharable link. Anyone with the link will be able to view the dashboard.
                            </p>
                            <div className="mt-3">
                                <div className="flex items-center gap-x-4 py-4">
                                    <label htmlFor="name" className="m-0">Share publicly</label>
                                    <Switch
                                        checked={enabled}
                                        onChange={setEnabled}
                                        className={`${enabled ? "bg-highlight" : "bg-gray-300"}
                                    relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                                    >
                                        <span className="sr-only">Dashboard sharing</span>
                                        <span
                                            aria-hidden="true"
                                            className={`${enabled ? "translate-x-5" : "translate-x-0"}
                                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white ring-0 transition duration-200 ease-in-out`}
                                        />
                                    </Switch>
                                </div>
                                <div className={`${enabled ? "opacity-100" : "opacity-50"}`}>
                                    <div className="mt-4">
                                        <label htmlFor="name">Shareable link</label>
                                        <input
                                            type="text"
                                            name="dashboard-link"
                                            id="dashboard-link"
                                            className={`form-input ${!enabled ? "blur-sm" : ""}`}
                                            disabled={true}
                                            value={`${process.env.NEXT_PUBLIC_APP_URL}/public/dashboard/${dashboard?.public_hash}`}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="name">Shareable edmbed code</label>
                                        <input
                                            type="text"
                                            name="dashboard-link"
                                            id="dashboard-link"
                                            className={`form-input ${!enabled ? "blur-sm" : ""}`}
                                            disabled={true}
                                            value={`<iframe src="${process.env.NEXT_PUBLIC_APP_URL}/public/dashboard/${dashboard?.public_hash}" width="100%" height="600px" frameborder="0" style="border:0" allowfullscreen></iframe>`}
                                        />
                                    </div>
                                </div>
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
                            <button className="btn-default">Save dashboard</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}
