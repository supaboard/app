import { PlusIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { cookies } from "next/headers"


async function getData() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/contacts`, {
		headers: { Cookie: cookies().toString() }
	})
	if (!res.ok) {
		throw new Error("Failed to fetch data")
	}

	return res.json()
}


export default async function Segments() {
	const data = await getData()
	const cookieStore = cookies()

	return (
		<div className="mt-10 px-4">
			{(!data.contacts || data.contacts.length === 0) && (
				<div className="relative max-w-xl mx-auto block w-full rounded p-12 text-center">
					<div className="w-14 h-14 bg-dark border-4 border-highlight rounded-lg -rotate-6 relative mx-auto shadow-xl drop-shadow-lg">
						<PlusIcon className="w-8 h-8 mx-auto text-highlight absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
					</div>
					<span className="mt-6 block text-sm text-gray-500 mx-auto">
						You don&apos;t have any users yet. <br /> Import contacts to get started.
					</span>
					<Link href="/contacts/import">
						<button className=" btn-default mt-6">
							Tell us where to find your users
						</button>
					</Link>
				</div>
			)}
			{data.contacts && data.contacts.length > 0 && (
				<div>
					<div className="inline-block w-full align-middle p-4">
						<div className="overflow-scroll max-w-full">
							<table className="divide-y divide-gray-300 border border-gray-200">
								<thead className="border border-gray-200">
									<tr className="divide-x divide-gray-200 bg-gray-50">
										{data.attributes.map((attribute) => (
											<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6" key={attribute.identifier}>
												{attribute.identifier}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 bg-white">
									{data.contacts.map((person) => (
										<tr key={person.email} className="divide-x divide-gray-200">
											{data.attributes.map((attribute) => (
												<td className="max-w-md overflow-hidden whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6" key={attribute.name}>
													{person[attribute?.name] && typeof person[attribute?.name] === "object" && (
														<>
															{JSON.stringify(person[attribute?.name])}
														</>
													)}
													{person[attribute?.name] && typeof person[attribute?.name] !== "object" && (
														<span>{person[attribute?.name] || "—"}</span>
													)}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
