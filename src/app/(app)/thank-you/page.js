import Logo from "@/components/brand/Logo"

export default async function ThankYou() {
	return (
		<div className="max-w-2xl px-4 mx-auto mt-12 text-center">
			<div className="flex justify-center mb-12">
				<Logo />
			</div>
			<h1 className="text-3xl font-black">Thank you!</h1>
			<p className="mt-4 text-lg text-gray-600">
				You&apos;re awesome. Thank you very much for signing up for Supaboard! If
				you need help with anything, don&apos;t hesitate to contact us.
			</p>
			<div className="mt-8">
				<a href={process.env.NEXT_PUBLIC_APP_URL} className="btn-default py-2 px-4">
					Go Home
				</a>
			</div>
		</div>
	)
}
