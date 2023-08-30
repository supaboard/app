import React from "react"
import { ChartError } from "./ChartError"


class ChartErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error) {
		return { hasError: true }
	}

	componentDidCatch(error, errorInfo) {
		console.log({ error, errorInfo })
	}

	render() {
		if (this.state.hasError) {
			return (
				<ChartError />
			)
		}

		return this.props.children
	}
}

export default ChartErrorBoundary
