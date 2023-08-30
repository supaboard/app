import Link from "next/link"
import { PlusIcon } from "@heroicons/react/24/outline"
import { cookies } from "next/headers"
import { formatDate } from "@/components/util"

async function getData() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/databases`, {
		headers: { Cookie: cookies().toString() }
	})
	if (!res.ok) {
		throw new Error("Failed to fetch data")
	}

	return res.json()
}

export default async function Databases() {
	const databases = await getData()

	return (
		<div>
			<div className="flex items-center px-8 gap-x-4 place-content-end bg-gray-50 border-b border-gray-200 divide-x divide-gray-200 font-semibold text-sm p-3">
				<Link href={"/databases/new"}>
					<button className="btn-default">
						Add database
					</button>
				</Link>
			</div>
			<div className="py-8 p-8">
				{(!databases || databases.length == 0) && (
					<div className="relative max-w-xl mx-auto block w-full rounded p-12 text-center">
						<div className="w-14 h-14 bg-dark border-4 border-highlight rounded-lg -rotate-6 relative mx-auto shadow-xl drop-shadow-lg">
							<PlusIcon className="w-8 h-8 mx-auto text-highlight absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
						</div>
						<span className="mt-6 block text-sm text-gray-500 mx-auto">
							You don&apos;t have any databases yet. <br /> Create a new database to get started.
						</span>
						<Link href="/databases/new">
							<button className=" btn-default mt-6">
								Create a new database
							</button>
						</Link>
					</div>
				)}
				{databases && databases.length > 0 && (
					<div>
						<div className="grid grid-cols-12 gap-8">
							{databases && databases.length > 0 && databases.map((database) => (
								<div className="col-span-3" key={database.uuid}>
									<Link href={`/databases/${database.uuid}`} className="block w-full">
										<div className={"block cursor-pointer text-left p-0 m-0 bg-white border border-gray-200 rounded-lg shadow-sm drop-shadow-lg h-full ring-2 ring-transparent hover:ring-highlight hover:shadow-lg transition-all"}>
											<div className="p-4 border-b border-gray-200">
												<img src={`/img/databases/${database.type}.svg`} alt={database.type} className="w-12 h-12 rounded-t-lg" />
											</div>
											<div className="p-4">
												<p className="text-xs text-gray-600 bg-gray-50 py-0.5 px-2 border borde-gray-200 rounded inline-block capitalize">{database.type}</p>
												<b className="block mt-4">{database.name}</b>
												<p className="block mt-2 text-gray-400 text-sm">
													Created: {formatDate(database.created_at)}
												</p>
												<button className="btn-default w-full !font-semibold place-content-center !bg-highlight mt-4">
													Edit connection
												</button>
											</div>
										</div>
									</Link>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
