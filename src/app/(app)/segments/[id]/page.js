import { PlusIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { cookies } from "next/headers"


async function getData(id) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/segments/${id}`, {
		headers: { Cookie: cookies().toString() }
	})
	if (!res.ok) {
		throw new Error("Failed to fetch data")
	}

	return res.json()
}


export default async function Segments({ params }) {
	const { id } = params
	const data = await getData(id)

	return (
		<div className="mt-10">
			{data.contacts && data.contacts.length > 0 && (
				<div>
					<div className="inline-block w-full align-middle p-4">
						<div className="overflow-scroll max-w-full">
							<table className="min-w-full divide-y divide-gray-300 border border-gray-200">
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
