"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Toaster, toast } from "sonner"
import Link from "next/link"
import { can } from "@/lib/auth"

import Modal from "@/components/util/Modal"
import Skeleton from "@/components/Skeleton"
import { deleteWorkspace, updateMembers, updateWorkspace } from "./actions"
import Loading from "@/components/Loading"

export const userTypeOptions = [
	{
		label: "Member",
		value: "member"
	},
	{
		label: "Owner",
		value: "owner"
	}
]

export default function Settings({ params }) {
	const { account_id } = params
	const router = useRouter()
	const supabase = createClientComponentClient({
		options: {
			db: { schema: "supaboard" }
		}
	})
	let [isPending, startTransition] = useTransition()
	const [showConfirmDelete, setShowConfirmDelete] = useState(false)
	const [user, setUser] = useState(null)
	const [team, setTeam] = useState(null)
	const [invites, setInvites] = useState(null)
	const [allowedToInvite, setAllowedToInvite] = useState(false)

	const [showAddUserModal, setShowAddUserModal] = useState(false)

	const [loading, setLoading] = useState(true)
	const [email, setEmail] = useState(null)
	const [sendEmail, setSendEmail] = useState(true)
	const [userType, setUserType] = useState(userTypeOptions[0].value)

	useEffect(() => {
		if (!account_id) return

		const checkCreateAllowed = async () => {
			const allowed = await can("invite:member")
			if (!allowed) {
				setAllowedToInvite(false)
			} else {
				setAllowedToInvite(true)
			}
		}

		const getTeam = async () => {
			setLoading(true)
			const { data, error } = await supabase
				.from("accounts")
				.select("team_name, id, personal_account, account_user(account_role), profiles(*)")
				.eq("id", account_id)

				.single()

			if (error) {
				toast.error("Something went wrong. Please try again.")
				return
			}

			setTeam(data)
			setLoading(false)
		}

		const getInvites = async () => {
			const { data, error } = await supabase
				.from("email_invitations")
				.select()
				.eq("account_id", account_id)
				.order("created_at", { ascending: false })

			if (error) {
				toast.error("Coudnl't fetch pending invites.")
				return
			}

			setInvites(data)
		}

		checkCreateAllowed()
		getTeam()
		getInvites()
	}, [account_id])


	const inviteUser = async () => {
		setLoading(true)
		if (!email) {
			toast.error("Please enter an email address.")
			setLoading(false)
			return
		}

		if (invites?.find((invite) => invite.email === email)) {
			toast.error("This user has already been invited.")
			setLoading(false)
			return
		}

		if (team?.profiles?.find((user) => user.email === email)) {
			toast.error("This user is already a member of this team.")
			setLoading(false)
			return
		}

		const memberData = {
			email: email,
			invited_by_user_id: user.id,
			role: userType,
			send_email: sendEmail
		}

		startTransition(() => updateMembers(memberData))
		if (!isPending) {
			router.push("/settings/members")
		}

		setLoading(false)
	}


	const removePendingInvite = async (profile) => {
		const { data, error } = await supabase
			.from("email_invitations")
			.delete()
			.eq("id", profile.id)

		if (error) {
			toast.error("Something went wrong. Please try again.")
			return
		}

		toast.success("Invitation withdrawn successfully")
		setInvites(invites.filter((invite) => invite.id !== profile.id))
	}


	const deleteConfirmed = async () => {
		startTransition(() => deleteWorkspace(account_id))
		if (!isPending) {
			router.push("/settings/workspace")
		}
	}

	return (
		<>
			<p className="text-gray-400">
				Invite and manage members to start collaborating on Supaboard
			</p>

			<div className="border border-gray-200 divide-y divide-gray-200 max-w-xl mt-4">
				<div className="p-4 py-2 bg-gray-50">
					<span className="text-left text-sm font-semibold text-gray-900">
						Workspace name
					</span>
				</div>
				<div className="p-4">
					{!team && (
						<>
							<Skeleton />
							<div className="flex place-content-end mt-4">
								<Skeleton className="w-20" width={20} />
							</div>
						</>
					)}
					{team && (
						<form action={async (data) =>
							updateWorkspace(account_id, data)
								.then((res) => {
									toast.success("Workspace name updated successfully.")
								}).catch((err) => {
									toast.error("Something went wrong. Please try again.")
								})
						}
						>
							<input type="text" name="team_name" id="team_name" className="form-input" defaultValue={team?.team_name ? team.team_name : "Personal"} />
							<div className="flex place-content-end">
								<button type="submit" className="btn btn-default !text-sm mt-4">
									Save name
								</button>
							</div>
						</form>
					)}
				</div>
			</div>

			<div className="border border-gray-200 divide-y divide-gray-200 max-w-xl mt-8">
				<div className="p-4 py-2 bg-gray-50 flex items-center">
					<span className="text-left text-sm font-semibold text-gray-900 grow">
						Team members {!loading && !allowedToInvite && (<> — Upgrade required</>) }
					</span>
				</div>
				{!allowedToInvite && (
					<>
						{loading && (
							<div className="p-4">
								<ul role="list" className="mt-4">
									{[...Array(3)].map((e, i) => (
										<li key={i} className="flex items-center p-2 mb-4 bg-white rounded-md">
											<Skeleton />
										</li>
									))}
									</ul>
								</div>
						)}
						{!loading && (
							<div className="p-4">
								<p className="mt-2">
									Your current plan does not support team workspaces. Please upgrade to create team workspaces and invite members.
								</p>
								<div className="flex place-content-end">
									<Link href="/settings/billing" className="btn-default !text-sm inline-block">
										Upgrade now
									</Link>
								</div>
							</div>
						)}
					</>
				)}
				{allowedToInvite && (
					<div className="p-4">
						<ul role="list" className="mt-4">
							{loading && (
								<>
									{[...Array(3)].map((e, i) => (
										<li key={i} className="flex items-center p-2 mb-4 bg-white rounded-md">
											<Skeleton />
										</li>
									))}
								</>
							)}
							{!loading && team?.profiles?.map((profile, index) => (
								<li
									key={index}
									className="flex items-center p-2 mb-4 bg-white border border-gray-200 rounded-md"
								>
									<div className="flex items-center grow">
										<div className="relative w-10 h-10 bg-gray-100 border border-gray-300 rounded-full">
											<span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
												{profile?.email[0].toUpperCase() || "M"}
											</span>
										</div>
										<div className="flex flex-col ml-3">
											<span className="text-sm text-gray-500">
												{profile.email}
											</span>
										</div>
									</div>
								</li>
							))}

							{!loading && invites?.map((profile, index) => (
								<li
									key={`inv-${index}`}
									className="flex items-center p-2 mb-4 bg-white border border-gray-200 rounded-md"
								>
									<div className="flex items-center grow">
										<div className="relative w-10 h-10 bg-gray-100 border border-gray-300 rounded-full">
											<span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
												{profile?.email[0].toUpperCase() || "M"}
											</span>
										</div>
										<div className="flex flex-col ml-3">
											<span className="text-sm text-gray-500">
												{profile.email}
											</span>
										</div>
										<div className="flex flex-col ml-3">
											<span className="px-4 py-1 text-sm text-gray-500 bg-gray-200 rounded-lg">
												Pending
											</span>
										</div>
									</div>
									<div
										onClick={() => removePendingInvite(profile)}
										className="cursor-pointer"
									>
										<XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
									</div>
								</li>
							))}
						</ul>
						<div className="flex place-content-end">
							<button
								onClick={() => setShowAddUserModal(true)}
								className="btn btn-default !text-sm"
							>
								+ Add team member
							</button>
						</div>
					</div>
				)}
			</div>

			<div className="border border-red-400 divide-y divide-gray-200 max-w-xl mt-8">
				<div className="p-4 py-2 bg-red-50 flex items center">
					<span className="text-left text-sm font-semibold text-gray-900 grow">
						Delete this workspace
					</span>
					<ExclamationTriangleIcon className="w-5 h-5 ml-2 text-red-400" />
				</div>
				<div className="p-4">
					<p>
						Deleting this workspace will delete all dashboards, charts, segments and data associated. Please be sure you want to delete this workspace.
						<b className="block mt-2">We will not be able to recover this data.</b>
					</p>
					<button
						onClick={() => setShowConfirmDelete(true)}
						className="btn btn-default !text-sm mt-4 w-full place-content-center !bg-red-400 !text-white"
					>
						Delete workspace
					</button>
				</div>
			</div>


			<Modal
				showModal={showAddUserModal}
				onClose={() => setShowAddUserModal(false)}
			>
				<div>
					<div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
						<b className="text-xl font-black">Invite new team members</b>
						<p className="text-sm text-gray-400">
							Create different invite codes for your team members to join your
							team. Choose between one-time codes and 24-hour codes as well as the
							role you want to assign to them.
						</p>
					</div>

					<div className="p-6">
						<label className="block text-xs font-bold text-gray-900 uppercase">
							E-Mail Address
						</label>
						<input
							className="block w-full py-2 pl-3 pr-10 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							id="email"
							type="text"
							onChange={(e) => setEmail(e.target.value)}
							onKeyUp={(e) => {
								if (e.key === "Enter") {
									inviteUser()
								}
							}}
							placeholder="email@example.com"
						/>
						<label className="block mt-4 text-xs font-bold text-gray-900 uppercase">
							Role
						</label>
						<select
							className="block w-full py-2 pl-3 pr-10 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							id="role"
							onChange={(e) => setUserType(e.target.value)}
							value={userType}
						>
							<option value="owner">Owner</option>
							<option value="member">Member</option>
						</select>

						<div className="flex mt-6 items center gap-x-2">
							<input
								type="checkbox"
								id="sendemail"
								name="sendemail"
								value="sendemail"
								onChange={(e) => setSendEmail(e.target.checked)}
								checked={sendEmail}
							/>
							<label className="block text-xs font-bold text-gray-900 uppercase">
								Send email invite
							</label>
						</div>

						<div className="flex items-center mt-6 place-content-end">
							<button
								onClick={() => setShowAddUserModal(false)}
								className="mr-4 btn"
							>
								Cancel
							</button>
							<button
								onClick={() => inviteUser()}
								className={`btn-default min-w-[150px] place-content-center text-center ${loading ? "opacity-50 pointer-events-none" : ""
									}`}
								disabled={loading}
							>
								{loading && (
									<Loading className="w-4 h-4 mr-2 text-white" />
								)}
								{!loading && (
									<>Invite</>
								)}
							</button>
						</div>
					</div>
				</div>
			</Modal>

			<Modal
				showModal={showConfirmDelete}
				onClose={() => setShowConfirmDelete(false)}
			>
				<div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
					<b className="text-xl font-black">Really delete this workspace?</b>
				</div>

				<div className="p-6">
					<p>
						Are you sure you want to delete the workspace <b>&apos;{team?.team_name}&apos;</b>?
						<b className="block mt-2">We will not be able to recover this data.</b>
					</p>
				</div>
				<div className="flex gap-x-4 mt-10 place-content-end bg-gray-50 rounded-b-lg border-t border-gray-200 py-3 px-6">
					<button
						onClick={() => setShowConfirmDelete(false)}
						className="mr-4 btn"
					>
						Cancel
					</button>
					<button
						onClick={deleteConfirmed}
						className={`btn-default min-w-[150px] place-content-center text-center !bg-red-400 !text-white ${loading ? "opacity-50 pointer-events-none" : ""}`}
						disabled={loading}
					>
						{loading && (
							<Loading className="w-4 h-4 mr-2 text-white" />
						)}
						{!loading && (
							<>Yes, delete this workspace</>
						)}
					</button>
				</div>
			</Modal>

			<Toaster />
		</>
	)
}
