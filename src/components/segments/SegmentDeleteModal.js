"use client"

import Modal from "@/components/util/Modal"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { deleteSegment } from "@/app/(app)/segments/actions"

export function SegmentDeleteModal({ segment, showModal, setShowModal, setUpdateHash }) {
    const router = useRouter()

    return (
        <>
        <Modal
                showModal={showModal}
                onClose={() => setShowModal(false)}
            >
                <div>
                    <div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
                        <b className="text-xl font-black">Really detele this segment?</b>
                    </div>
                    <form
                        action={async () =>
                            deleteSegment(segment)
                                .then(async (res) => {
                                    setShowModal(false)
                                    toast.success("Segment deleted!")
									setUpdateHash(Math.random())
                                    router.push("/segments")
                                    router.refresh()
                                })
                                .catch((err) => toast.error(err.message))
                        }
                        className="rounded-b-lg bg-white"
                    >
                        <p className="p-6">
                            Are you sure you want to delete the sgment &quot;<b>{segment?.name}</b>&quot; and all its filters and settings? This action <i>cannot be undone</i>.
                        </p>
                        <div className="flex gap-x-4 mt-10 place-content-end bg-gray-50 rounded-b-lg border-t border-gray-200 py-3 px-6">
                            <div
                                className="btn-secondary cursor-pointer"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </div>
                            <button className="btn-default">Delete segment</button>
                        </div>
                    </form>
                </div>
            </Modal>
            </>
    )
}
