const nextBuildId = require("next-build-id")

const nextConfig = {
	generateBuildId: () => nextBuildId({ dir: __dirname }),
	experimental: {
		appDir: true,
		serverActions: true,
		esmExternals: "loose",
		instrumentationHook: true
	},
	productionBrowserSourceMaps: false,
	async redirects() {
		return [
			{
				source: "/",
				destination: "/overview",
				permanent: true
			}
		]
	},
}

module.exports = nextConfig
