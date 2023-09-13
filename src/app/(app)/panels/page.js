import Link from "next/link"
import { PlusIcon } from "@heroicons/react/24/outline"
import { cookies } from "next/headers"
import { formatDate } from "@/components/util"
import { NoPanels } from "@/components/panels/NoPanels"

async function getData() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/panels`, {
		headers: { Cookie: cookies().toString() }
	})
	if (!res.ok) {
		throw new Error("Failed to fetch data")
	}

	return res.json()
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
                {panels && panels.length > 0 && (
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden ">
                            <table className="min-w-full divide-y divide-gray-300 border border-gray-200">
                                <thead className="border border-gray-200">
                                    <tr className="divide-x divide-gray-200 bg-gray-50">
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Name
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Charts
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Timeframe
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Created
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white cursor-pointer">
                                    {panels.map((dashboard) => (

                                        <tr key={dashboard.id} className="divide-x divide-gray-200 hover:bg-green-50">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                <Link href={`/panels/${dashboard.uuid}`} className="block w-full">
                                                    {dashboard.name}
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <Link href={`/panels/${dashboard.uuid}`} className="block w-full">
                                                    {dashboard.config?.charts?.length || "no"} charts
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <Link href={`/panels/${dashboard.uuid}`} className="block w-full">
													{typeof dashboard.config?.timeframe === "string" && dashboard.config?.timeframe?.replaceAll("_", " ")}
													{typeof dashboard.config?.timeframe === "object" && (
														<>
															{ formatDate(dashboard.config?.timeframe[0])}
															<span> - </span>
															{formatDate(dashboard.config?.timeframe[1])}
														</>
													)}
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <Link href={`/panels/${dashboard.uuid}`} className="block w-full">
                                                    {formatDate(dashboard.created_at)}
                                                </Link>
                                            </td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
				{(!panels || panels.length == 0) && (
                    <NoPanels />
                )}
            </div>
		</div>
	)
}
