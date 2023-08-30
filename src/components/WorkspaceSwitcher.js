"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

import { getUserAccounts } from "@/lib/auth"
import Loading from "@/components/Loading"
import Link from "next/link"

export const WorkspaceSwitcher = ({ modalState }) => {
	const router = useRouter()
	const [accounts, setAccounts] = useState(null)
	const [activeAccount, setActiveAccount] = useState(null)

	const supabase = createClientComponentClient({
		options: {
			db: { schema: "supaboard" }
		}
	})


	const changeTeam = async (team) => {
		document.cookie = `account_id=${team.account_id}; path=/;`

		if (modalState) {
			modalState(false)
		}
		router.push("/overview")
		router.refresh()
	}

	useEffect(() => {
		const getAccounts = async () => {
			setActiveAccount(document.cookie.split("; ").find(row => row.startsWith("account_id")).split("=")[1])
			const { data: { session } } = await supabase.auth.getSession()
			let response = await getUserAccounts(supabase, session.user.id)
			setAccounts(response)
		}

		getAccounts()
	}, [])


	return (
		<div>
			<div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
				<b className="text-xl font-black">Change workspace</b>
				<p className="mt-1 text-sm text-gray-500">
					Switch between the workspaces you&apos;re a member of
				</p>
			</div>
			<div className="rounded-b-lg bg-white p-6">
				<div className="flex items-center">
					<div className="grow">

						<div className="mt-4">
							<div className="">
								{!accounts && <Loading />}
								{accounts && accounts.map((account, index) => (
									<button
										onClick={() => {
											changeTeam(account)
										}}
										className={`flex text-left items-center p-2 border ${activeAccount == account.account_id ? "border-highlight bg-green-50" : "border-gray-200"}  rounded-lg w-full mb-3 hover:bg-gray-100`}
										key={`acc-${index}`}
									>
										<div className="shrink-0 flex items-center justify-center w-8 h-8 mr-2 text-sm text-white bg-gray-300 rounded-full">
											<span className="font-bold">
												{account.accounts.team_name && (
													account.accounts.team_name[0].toUpperCase()
												)}
												{!account.accounts.team_name && (
													<>P</>
												)}
											</span>
										</div>
										<div className="flex flex-col grow ml-2">
											<span className="text-sm font-bold text-gray-900">
												{account.accounts?.team_name || "Personal"}
											</span>
										</div>
										<span className="text-xs text-gray-500 pr-2">
											{(activeAccount == account.account_id) && (
												<div className="flex items-center">
													<div className="w-2 h-2 bg-green-500 rounded-full"></div>
												</div>
											)}
										</span>
									</button>
								))}
							</div>
							<div className="w-full text-right mt-4">
								<Link
									href="/settings/workspace"
									className="text-xs text-gray-400 underline"
									onClick={() => {
										if (modalState) {
											modalState(false)
										}
									}}
								>
									Create a new workspace
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
