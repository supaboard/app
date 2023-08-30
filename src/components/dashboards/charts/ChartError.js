"use client"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"

export function ChartError() {
	return (
		<div className="realtive h-100">
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<ExclamationTriangleIcon className="h-8 w-8 text-gray-400 block mx-auto" />
				<div className="text-gray-400 font-bold text-md mt-2">Error loading chart</div>
			</div>
		</div>
	)
}
