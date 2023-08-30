import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { classNames } from "@/util"
import Link from "next/link"
import Loading from "@/components/Loading"


async function getData() {
	const cookieStore = cookies()
	const account_id = cookieStore.get("account_id").value
	const supabase = createServerComponentClient({ cookies }, {
		options: {
			db: { schema: "supaboard" }
		}
	})
	const { data: { session } } = await supabase.auth.getSession()

	const { data, error } = await supabase
		.from("accounts")
		.select("team_name, id, personal_account, billing_subscriptions(status), account_user!inner(account_role)")
		.eq("account_user.user_id", session.user.id)


	if (error) {
		console.log(error)
		return null
	}

	return data
}

export default async function Settings() {
	const teams = await getData()

	return (
		<>
			<p className="text-gray-400">
				Manage your workspace details
			</p>


			<div className="border border-gray-200 divide-y divide-gray-200 max-w-xl mt-4">
				<table className="min-w-full divide-y divide-gray-300">
					<thead className="bg-gray-200">
						<tr className="bg-gray-100">
							<th
								scope="col"
								className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900"
							>
								Team name
							</th>
							<th
								scope="col"
								className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
							>
								Plan
							</th>
							<th
								scope="col"
								className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
							>
								Status
							</th>
							<th
								scope="col"
								className="hidden px-3 py-3.5 text-sm font-semibold text-gray-900 lg:table-cell text-right"
							>
								{/* empty */}
							</th>
						</tr>
					</thead>
					<tbody className="bg-white">
						{!teams && (
							<tr>
								<td
									colSpan="4"
									className="py-4 pl-6 pr-3 text-sm text-gray-500"
								>
									<div className="flex items-center">
										<Loading />
									</div>
								</td>
							</tr>
						)}
						{teams && teams.length == 0 && (
							<tr>
								<td
									colSpan="4"
									className="py-4 pl-6 pr-3 text-sm text-gray-500"
								>
									<div className="flex items-center">
										<i>No teams yet</i>
									</div>
								</td>
							</tr>
						)}
						{teams &&
							teams.length > 0 &&
							teams.map((team, teamIdx) => (
								<tr key={team.id}>
									<td
										className={classNames(
											teamIdx === 0 ? "" : "border-t border-gray-200",
											"relative py-4 pl-6 pr-3 text-sm"
										)}
									>
										<div className="font-medium text-gray-900">
											{team.team_name || "Personal"}
										</div>
									</td>
									<td
										className={classNames(
											teamIdx === 0 ? "" : "border-t border-gray-200",
											"hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
										)}
									>
										{team.billing_subscriptions?.length > 0 ? "Paid" : "Free"}
									</td>
									<td
										className={classNames(
											teamIdx === 0 ? "" : "border-t border-gray-200",
											"hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
										)}
									>
										{team.account_user[0].account_role === "owner"
											? "Owner"
											: "Member"}
									</td>
									<td
										className={classNames(
											teamIdx === 0 ? "" : "border-t border-gray-200",
											"hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell text-right"
										)}
									>
										{team.account_user[0].account_role === "owner" && (
											<Link
												href={`/settings/workspace/${team.id}`}
												className="p-2 text-sm text-black transition-colors border border-black rounded hover:bg-black hover:text-white"
											>
												Manage
											</Link>
										)}
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>

			<div className="border border-gray-200 divide-y divide-gray-200 max-w-xl mt-8">
				<div className="p-4 py-2 bg-gray-50 flex items-center">
					<span className="text-left text-sm font-semibold text-gray-900 grow">
						Create a new workspace
					</span>
				</div>
				<div className="flex p-4 md:gap-x-10">
					<p className="text-gray-400 grow text-sm">
						Separate workspaces allow you to manage individual projects easily and invite your team members per workspace.
					</p>
					<div className="grow shrink-0">
						<Link href="/settings/workspace/new" className="btn btn-default !text-sm mt-4 !inline-block">
							Create workspace
						</Link>
					</div>
				</div>
			</div>
		</>
	)
}
