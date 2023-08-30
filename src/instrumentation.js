export async function register() {
	if (process.env.NEXT_RUNTIME == "nodejs" && process.env.IS_PLATFORM == true && process.env.NEXT_PUBLIC_ENV != "dev") {
		const { registerHighlight } = await import("@highlight-run/next/server")

		registerHighlight({
			projectID: process.env.NEXT_PUBLIC_HIGHLIGHT_KEY,
		})
	}
}
