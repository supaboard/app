import Link from "next/link"
import { PlusIcon } from "@heroicons/react/24/outline"
import { cookies } from "next/headers"
import { formatDate } from "@/components/util"

async function getData() {
	// const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/panels`, {
	// 	headers: { Cookie: cookies().toString() }
	// })
	// if (!res.ok) {
	// 	throw new Error("Failed to fetch data")
	// }

	// return res.json()
}

export default async function Panels() {
	const panels = await getData()

	return (
		<div>
			<div className="flex items-center px-8 gap-x-4 place-content-end bg-gray-50 border-b border-gray-200 divide-x divide-gray-200 font-semibold text-sm p-3">
				<Link href={"/panels/new"}>
					<button className="btn-default">
						Add panel
					</button>
				</Link>
			</div>
			<div className="py-8 p-8">

			</div>
		</div>
	)
}
