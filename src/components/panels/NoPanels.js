"use client"

import { useState } from "react"
import { Toaster } from "sonner"

import { Square3Stack3DIcon } from "@heroicons/react/24/outline"
import { PanelNewModal } from "./PanelNewModal"


export function NoPanels() {
	const [showModal, setShowModal] = useState(false)

	return (
		<>
			<div className="relative max-w-xl mx-auto block w-full rounded p-12 text-center" >
				<div className="w-14 h-14 bg-dark border-4 border-highlight rounded-lg -rotate-6 relative mx-auto shadow-xl drop-shadow-lg">
					<Square3Stack3DIcon className="w-8 h-8 mx-auto text-highlight absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
				</div>
				<span className="mt-6 block text-sm text-gray-500 mx-auto">
					You don&apos;t have any panels yet. <br /> Create a new panel to get started.
				</span>
				<button
					className="btn-default mt-6"
					onClick={() => setShowModal(true)}
				>
					Create a new panel
				</button>
			</div>
			<PanelNewModal showModal={showModal} setShowModal={setShowModal} />
			<Toaster />
		</>
	)
}
