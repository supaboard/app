"use client"

import Script from "next/script"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { HighlightInit, ErrorBoundary } from "@highlight-run/next/client"
import { useEffect } from "react"
import { Crisp } from "crisp-sdk-web"

if (typeof window !== "undefined") {
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST
	})
}

export function Telemetry({ children }) {
	useEffect(() => {
		Crisp.configure(process.env.NEXT_PUBLIC_CRISP_ID)
	}, [])

	return (
		<>
			<HighlightInit
				projectId={process.env.NEXT_PUBLIC_HIGHLIGHT_KEY}
				tracingOrigins
				networkRecording={{
					enabled: true,
					recordHeadersAndBody: true,
					urlBlocklist: [],
				}}
			/>
			<html lang="en">
				<ErrorBoundary>
					<PostHogProvider client={posthog}>
						<body>{children}</body>
					</PostHogProvider>
				</ErrorBoundary>
				<Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
				<noscript>
					{/* eslint-disable @next/next/no-img-element */}
					<img
						src="https://queue.simpleanalyticscdn.com/noscript.gif"
						alt=""
						referrerPolicy="no-referrer-when-downgrade"
					/>
				</noscript>
			</html>
		</>
	)
}
