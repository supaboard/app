"use client"

import Link from "next/link"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import Tippy from "@tippyjs/react"

export function DatabaseTypes({ databaseType, setDatabaseType, activeStep, setActiveStep }) {
	return (
		<div className="max-w-lg mx-auto block cursor-pointer text-left m-0 bg-white border border-gray-200 rounded-lg shadow-sm drop-shadow-lg h-full">
			<div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-6">
				<b className="text-xl font-black">Database connection</b>
			</div>

			<div className="grid grid-cols-12 gap-4 p-6">
				<div className="col-span-12">
					<div
						className={`
							block cursor-pointer text-left p-0 m-0 bg-white border border-gray-200 rounded-lg h-full ring-2 ring-transparent hover:ring-highlight hover:shadow-lg transition-all
							${databaseType == "supabase" ? "!ring-highlight shadow-lg" : ""}
						`}
						onClick={() => {
							setDatabaseType("supabase")
						}}
					>
						<div className="flex gap-x-2 items-center p-2">
							<img src="/img/databases/supabase.svg" alt="Supabase" className="w-12 h-12 rounded-t-lg" />
							<div className="p-4">
								<b>Supabase</b>
							</div>
						</div>
					</div>
				</div>
				<div className="col-span-12">
					<div
						className={`
							block cursor-pointer text-left p-0 m-0 bg-white border border-gray-200 rounded-lg h-full ring-2 ring-transparent hover:ring-highlight hover:shadow-lg transition-all
							${databaseType == "postgres" ? "!ring-highlight shadow-lg" : ""}
						`}
						onClick={() => {
							setDatabaseType("postgres")
						}}
					>
						<div className="flex gap-x-2 items-center p-2">
							<img src="/img/databases/postgres.svg" alt="Postgres" className="w-12 h-12 rounded-t-lg" />
							<div className="p-4">
								<b>Postgres</b>
							</div>
						</div>
					</div>
				</div>
				<div className="col-span-12">
					<Tippy content="Coming soon">
						<div
							className={`
							opacity-25
							block cursor-pointer text-left p-0 m-0 bg-white border border-gray-200 rounded-lg h-full ring-2 ring-transparent hover:ring-highlight hover:shadow-lg transition-all
							${databaseType == "planetscale" ? "!ring-highlight shadow-lg" : ""}
						`}
						>
							<div className="flex gap-x-2 items-center p-2">
								<img src="/img/databases/planetscale.svg" alt="Postgres" className="w-12 h-12 rounded-t-lg" />
								<div className="p-4">
									<b>Planetscale</b>
								</div>
							</div>
						</div>
					</Tippy>
				</div>
				<div className="col-span-12">
					<Tippy content="Coming soon">
						<div
							className={`
							opacity-25
							block cursor-pointer text-left p-0 m-0 bg-white border border-gray-200 rounded-lg h-full ring-2 ring-transparent hover:ring-highlight hover:shadow-lg transition-all
							${databaseType == "mysql" ? "!ring-highlight shadow-lg" : ""}
						`}
						>
							<div className="flex gap-x-2 items-center p-2">
								<img src="/img/databases/mysql.svg" alt="Postgres" className="w-12 h-12 rounded-t-lg" />
								<div className="p-4">
									<b>MySQL</b>
								</div>
							</div>
						</div>
					</Tippy>
				</div>
			</div>
			<div className="flex gap-x-4 mt-10 place-content-end bg-gray-50 rounded-b-lg border-t border-gray-200 py-3 px-6">
				<div className="text-left">
					<Link href="/databases" className="btn-secondary flex items-center">
						Cancel
					</Link>
				</div>
				<div className="flex grow place-content-end">
					<button
						className={`btn-default flex items-center ${databaseType ? "opacity-100" : "opacity-50"}`}
						onClick={() => {
							setActiveStep(activeStep + 1)
						}}
						disabled={!databaseType}
					>
						Next
						<ArrowRightIcon className="h-4 w-4 ml-2" />
					</button>
				</div>
			</div>
		</div>
	)
}
