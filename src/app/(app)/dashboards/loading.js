import Loading from "@/components/Loading"

export default async function LoadingDashboards() {
    return (
        <>
            <div className="py-8 p-8">
                <div className="relative max-w-xl mx-auto block w-full rounded p-12 text-center">
                    <div className="w-14 h-14 bg-dark border-4 border-highlight rounded-lg -rotate-6 relative mx-auto shadow-xl drop-shadow-lg">
                        <Loading className="mt-2.5" />
                    </div>
                    <div className="mt-6">
                        <span className="block text-sm text-gray-500 mx-auto">
                            Loading dashboards...
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}
