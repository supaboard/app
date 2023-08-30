"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { DatabaseTypes } from "@/components/databases/steps/DatabaseTypes"
import { DatabaseDetails } from "@/components/databases/steps/DatabaseDetails"
import { createDatabase } from "../actions"
import { can } from "@/lib/auth"
import useStore from "@/store/index"

export default function NewDatabase({ params }) {
	const router = useRouter()
	let [isPending, startTransition] = useTransition()
	const [activeStep, setActiveStep] = useState(1)
	const [databaseType, setDatabaseType] = useState(null)
	const [databaseDetails, setDatabaseDetails] = useState(null)
	const { showUpgradeModal, setShowUpgradeModal } = useStore()

	useEffect(() => {
		const checkCreateAllowed = async () => {
			const allowed = await can("create:datasource")
			if (!allowed) {
				setShowUpgradeModal("create:datasource")
			}
		}

		checkCreateAllowed()
	}, [])

	const createNewDatabase = async () => {
		let connection = {
			host: databaseDetails.host,
			port: databaseDetails.port,
			user: databaseDetails.user,
			password: databaseDetails.password,
			database: databaseDetails.database,
		}

		startTransition(() => createDatabase(databaseDetails.name, databaseType, connection))
		if (!isPending) {
			router.push("/databases")
		}
	}


	return (
		<>
			<div className="flex items-center border-b border-gray-200 divide-x divide-gray-200 font-semibold text-sm">
				<div className={`flex items-center place-content-center gap-x-2 grow text-center p-4 ${activeStep == 1 ? "opacity-100 bg-gray-50" : "opacity-25"}`}>
					<div className="bg-highlight text-white rounded w-6 h-6 pt-0.5">1</div>
					<span>Choose database type</span>
				</div>
				<div className={`flex items-center place-content-center gap-x-2 grow text-center p-4 ${activeStep == 2 ? "opacity-100 bg-gray-50" : "opacity-25"}`}>
					<div className="bg-highlight text-white rounded w-6 h-6 pt-0.5">2</div>
					<span>Add connection details</span>
				</div>
			</div>

			<div className="py-8 p-8">
				<div className="mt-4">
					{activeStep == 1 && (
						<>
							<div>
								<DatabaseTypes
									databaseType={databaseType}
									setDatabaseType={setDatabaseType}
									activeStep={activeStep}
									setActiveStep={setActiveStep}
								/>
							</div>
						</>
					)}

					{activeStep == 2 && (
						<>
							<div>
								<DatabaseDetails
									databaseType={databaseType}
									databaseDetails={databaseDetails}
									setDatabaseDetails={setDatabaseDetails}
									activeStep={activeStep}
									setActiveStep={setActiveStep}
									createNewDatabase={createNewDatabase}
								/>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	)
}
