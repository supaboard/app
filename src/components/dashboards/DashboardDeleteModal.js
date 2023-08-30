"use client"

import Modal from "@/components/util/Modal"
import { deleteDahboard } from "@/app/(app)/dashboards/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function DashboardDeleteModal({ dashboard, showModal, setShowModal }) {
    const router = useRouter()

    return (
        <>
        <Modal
                showModal={showModal}
                onClose={() => setShowModal(false)}
            >
                <div>
                    <div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
                        <b className="text-xl font-black">Really detele this dashboard?</b>
                    </div>
                    <form
                        action={async () =>
                            deleteDahboard(dashboard)
                                .then(async (res) => {
                                    setShowModal(false)
                                    toast.success("Dashboard deleted!")
                                    router.push("/dashboards")
                                    router.refresh()
                                })
                                .catch((err) => toast.error(err.message))
                        }
                        className="rounded-b-lg bg-white"
                    >
                        <p className="p-6">
                            Are you sure you want to delete the dashboard &quot;<b>{dashboard?.name}</b>&quot; and all its charts and settings? This action <i>cannot be undone</i>.
                        </p>
                        <div className="flex gap-x-4 mt-10 place-content-end bg-gray-50 rounded-b-lg border-t border-gray-200 py-3 px-6">
                            <div
                                className="btn-secondary cursor-pointer"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </div>
                            <button className="btn-default">Delete dashboard</button>
                        </div>
                    </form>
                </div>
            </Modal>
            </>
    )
}
