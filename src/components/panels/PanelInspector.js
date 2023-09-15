"use client"

import store from "@/store"
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/outline"

export default function PanelInspector() {
	const { setActivePanelElement, activePanelElement } = store()

	function closeSlideover() {
		// Auto save...
		setActivePanelElement(null)
	}

	return (
		<>
			{!activePanelElement && (
				<div className="absolute inset-y-0 top-16  bottom-4 right-3 w-[110px] z-40 rounded">
					<div className="relative w-full text-center p-2 px-4 bg-white rounded shadow-xl border border-gray-200">
						<button
							className="text-sm flex items-center space-x-2"
							onClick={() => setActivePanelElement(1)}
						>
							<span>Inspector</span>
							<ChevronDoubleLeftIcon className="w-3 h-3 text-gray-400 inline-block ml-1" />
						</button>
					</div>
				</div>
			)}
			{activePanelElement && (
				<div className="fixed inset-y-0 top-16 flex bottom-4 right-3 w-[250px] z-40 rounded">
					<div className="relative w-full h-full overflow-y-scroll bg-white rounded shadow-xl">
						<div className="sticky top-0 z-10 bg-white border-b border-gray-300 text-sm">
							<div className="p-2 pl-3">
								<div className="flex items-center gap-x-2 w-full">
									{activePanelElement === 1 && (
										<span className="grow">
											No element
										</span>
									)}
									{activePanelElement && activePanelElement != 1 && (
										<>
											<input
												type="text"
												className="grow"
												placeholder="Element name"
												defaultValue={activePanelElement.label}
											/>
										</>
									)}
									<button
										type="button"
										className="flex-shrink-0 text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none"
										onClick={closeSlideover}
									>
										<span className="sr-only">Close panel</span>
										<ChevronDoubleRightIcon
											className="w-4 h-4"
											aria-hidden="true"
										/>
									</button>
								</div>
							</div>
						</div>

						<div className="relative flex-1 px-4 mt-6 sm:px-6">
							{activePanelElement === 1 && (
								<span>
									No element selected
								</span>
							)}
							{activePanelElement && activePanelElement != 1 && (
								<div>
									{activePanelElement.label}
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	)
}
