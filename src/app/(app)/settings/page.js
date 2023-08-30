import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"


// async function getData() {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/settings`)
//     if (!res.ok) {
//         throw new Error('Failed to fetch data')
//     }

//     return res.json()
// }

export default async function Settings() {
	const supabase = createServerComponentClient({ cookies })
	const { data: { session } } = await supabase.auth.getSession()

	// const data = await getData()

	return (
		<>
			<p className="text-gray-400">
				Manage your personal account information
			</p>
			<div className="border border-gray-200 divide-y divide-gray-200 max-w-xl mt-4">
				<div className="p-4 py-2 bg-gray-50">
					<span className="text-left text-sm font-semibold text-gray-900">
						Email
					</span>
				</div>
				<div className="p-4">
					<input type="text" className="form-input" defaultValue={session?.user?.email} />
				</div>
			</div>
		</>
	)
}
