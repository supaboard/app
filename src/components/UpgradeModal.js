"use client"

import useStore from "@/store/index"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Modal from "./util/Modal"

export function UpgradeModal() {
	const router = useRouter()
	const { showUpgradeModal, setShowUpgradeModal } = useStore()

	const redirectBack = () => {
		if (showUpgradeModal == "create:segment") {
			router.push("/segments")
		}
	}

	return (
		<>

			<Modal
				showModal={showUpgradeModal ? true : false}
				onClose={() => {
					return false
				}}
			>
				<div>
					<div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
						<b className="text-xl font-black">Upgrade required</b>
					</div>
					<div className="p-6">
						<p>
							{showUpgradeModal == "create:segment" && (
								<>
									You&apos;ve reached the limit of segments you can create on your current plan. Please upgrade to create more segments.
								</>
							)}
							{showUpgradeModal == "create:dashboard" && (
								<>
									You&apos;ve reached the limit of dashboards you can create on your current plan. Please upgrade to create more dashboards.
								</>
							)}
							{showUpgradeModal == "create:datasource" && (
								<>
									You&apos;ve reached the limit of data sources you can create on your current plan. Please upgrade to create more data sources.
								</>
							)}
						</p>
					</div>
					<div className="flex gap-x-4 mt-10 bg-gray-50 rounded-b-lg border-t border-gray-200 py-3 px-6">
						<div className="grow">
							<button
								className="btn-secondary"
								type="button"
								onClick={() => {
									setShowUpgradeModal(false)
									redirectBack()
								}}
							>
								Cancel
							</button>
						</div>
						<div className="grow text-right">
							<Link href="/settings/billing" onClick={() => setShowUpgradeModal(false)} className="btn-default inline-block">
								Upgrade now
							</Link>
						</div>
					</div>
				</div>
			</Modal>
		</>
	)
}
