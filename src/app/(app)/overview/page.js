import Link from "next/link"
import { cookies } from "next/headers"
import { ArrowUpRightIcon, ChartBarIcon, CircleStackIcon, UserGroupIcon } from "@heroicons/react/24/outline"

import { formatDate } from "@/components/util"

async function getCounts() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/counts`, { headers: { Cookie: cookies().toString() }})
	if (!res.ok) throw new Error("Failed to fetch data")
	return res.json()
}

async function getDashboards() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboards`, { headers: { Cookie: cookies().toString() }})
	if (!res.ok) throw new Error("Failed to fetch data")
	return res.json()
}


export default async function Overview() {
	const counts = await getCounts()
	const dashboards = await getDashboards()

	return (
		<div className="mt-10 px-8">
			<div className="md:flex items-center gap-4 space-y-2 xl:space-y-0">
				<div className="bg-white border border-gray-200 rounded-md grow group hover:bg-gray-50 hover:border-gray-300 transition-all">
					<Link href="/dashboards" className="block p-4">
						<div className="flex items-center relative">
							<div className="text-sm grow">All Dashboards</div>
							<ChartBarIcon className="absolute top-0 right-0 h-5 w-5 mr-1 opacity-100 group-hover:opacity-0 transition-all" />
							<ArrowUpRightIcon className="absolute top-0 right-0 h-4 w-4 inline-block opacity-0 group-hover:opacity-100 transition-all" />
						</div>
						<div className="font-bold text-lg mt-2">
							<div>{counts.dashboards}</div>
						</div>
					</Link>
				</div>
				<div className="bg-white border border-gray-200 rounded-md grow group hover:bg-gray-50 hover:border-gray-300 transition-all">
					<Link href="/segments" className="block p-4">
						<div className="flex items-center relative">
							<div className="text-sm grow">Created Segments</div>
							<UserGroupIcon className="absolute top-0 right-0 h-5 w-5 mr-1 opacity-100 group-hover:opacity-0 transition-all" />
							<ArrowUpRightIcon className="absolute top-0 right-0 h-4 w-4 inline-block opacity-0 group-hover:opacity-100 transition-all" />
						</div>
						<div className="font-bold text-lg mt-2">
						<div>{counts.segments}</div>
						</div>
					</Link>
				</div>
				<div className="bg-white border border-gray-200 rounded-md grow group hover:bg-gray-50 hover:border-gray-300 transition-all">
					<Link href="/databases" className="block p-4">
						<div className="flex items-center relative">
							<div className="text-sm grow">Connected Databases</div>
							<CircleStackIcon className="absolute top-0 right-0 h-5 w-5 mr-1 opacity-100 group-hover:opacity-0 transition-all" />
							<ArrowUpRightIcon className="absolute top-0 right-0 h-4 w-4 inline-block opacity-0 group-hover:opacity-100 transition-all" />
						</div>
						<div className="font-bold text-lg mt-2">
						<div>{counts.databases}</div>
						</div>
					</Link>
				</div>
			</div>
			<div className="md:grid grid-cols-12 gap-4 mt-6">
				<div className="col-span-7">
					<div className="bg-white h-full border border-gray-200 rounded-md pb-4">
						<div className="bg-gray-50 px-4 py-2 border-b border-gray-200 mb-6 rounded-t-md">
							<b className="block">Dashboards</b>
						</div>
						{dashboards.length === 0 && (
							<div className="px-4">
								<p className="text-gray-400 text-sm">
									You don&apos;t have any dashboards yet.
								</p>
							</div>
						)}
						{dashboards && dashboards.length > 0 && (
							<div className="[&>*:nth-child(odd)]:bg-gray-50 px-2">
								{dashboards.map((dashboard) => (
									<Link href={`/dashboards/${dashboard.uuid}`} className="flex w-full p-2 my-1 rounded hover:!bg-gray-100 transition-colors" key={dashboard.id}>
										<div className="grow">
											<b className="block">{dashboard.name}</b>
											<p className="text-gray-400 text-sm">
												{dashboard.config?.charts?.length || "no"}&nbsp;{dashboard.config?.charts?.length === 1 ? "chart" : "charts"}
											</p>
										</div>
										<div className="text-right my-auto text-sm">
											{formatDate(dashboard.updated_at)}
										</div>
									</Link>
								))}
							</div>
						)}
					</div>
				</div>
				<div className="mt-6 md:mt-0 col-span-5">
					<div className="bg-white h-full border border-gray-200 rounded-md pb-4">
						<div className="bg-gray-50 px-4 py-2 border-b border-gray-200 mb-6 rounded-t-md">
							<b className="block">Quick actions</b>
						</div>
						<div className="px-4">
							<Link href="/dashboards?new=true" className="flex text-left w-full p-2 my-1 rounded hover:!bg-gray-100 transition-colors">
								<div className="grow">
									<b className="block">Create a new dashboard</b>
									<p className="text-gray-400 text-sm">
										Build a new dashboard from scratch
									</p>
								</div>
								<div className="text-right my-auto text-sm">
									<ArrowUpRightIcon className="h-4 w-4 inline-block" />
								</div>
							</Link>
							<Link href="/segments/new" className="flex text-left w-full p-2 my-1 rounded hover:!bg-gray-100 transition-colors">
								<div className="grow">
									<b className="block">Create a new segment</b>
									<p className="text-gray-400 text-sm">
										Build a new segment from scratch
									</p>
								</div>
								<div className="text-right my-auto text-sm">
									<ArrowUpRightIcon className="h-4 w-4 inline-block" />
								</div>
							</Link>
							<Link href="/databases/new" className="flex text-left w-full p-2 my-1 rounded hover:!bg-gray-100 transition-colors">
								<div className="grow">
									<b className="block">Connect a new database</b>
									<p className="text-gray-400 text-sm">
										Connect a new database to Supaboard
									</p>
								</div>
								<div className="text-right my-auto text-sm">
									<ArrowUpRightIcon className="h-4 w-4 inline-block" />
								</div>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
