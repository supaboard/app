"use client"

import { useEffect, useRef } from "react"
import { NodeResizer } from "reactflow"
import store from "@/store"

export default function BaseElement({ data, children }) {
	const wrapperRef = useRef(null)
	const { nodes, setActivePanelElement, activePanelElement } = store()
	let node = nodes.find(node => node.id == data.id)

	function useOutsideAlerter(ref) {
		useEffect(() => {
			function handleClickOutside(event) {
				if (ref.current && !ref.current.contains(event.target)) {
					if (event.target.classList.contains("react-flow__pane")) {
						setActivePanelElement(null)
					}
				}
			}

			document.addEventListener("mousedown", handleClickOutside)
			return () => {
				document.removeEventListener("mousedown", handleClickOutside)
			}
		}, [ref])
	}

	useOutsideAlerter(wrapperRef)

	return (
		<>
			<div
				className="shadow-md min-h-[200px] min-w-[280px] h-full nowheel group"
				onClick={() => {
					setActivePanelElement(data)
				}}
				ref={wrapperRef}
			>
				<NodeResizer minWidth={280} minHeight={200} />
				<div className="w-full h-full bg-white min-h-[200px] rounded-md relative">
					<div className="opacity-0 group-hover:opacity-100 drag-pane flex items-center !cursor-grab bg-highlight absolute -top-9 p-2 pr-4 text-xs rounded">
						<svg width="15" height="15" viewBox="0 0 20 20" fill="none" ><path fillRule="evenodd" clipRule="evenodd" d="M6 5.38462C6 6.14932 6.64759 6.76923 7.44643 6.76923C8.24527 6.76923 8.89286 6.14932 8.89286 5.38462C8.89286 4.61991 8.24527 4 7.44643 4C6.64759 4 6 4.61991 6 5.38462ZM6 10C6 10.7647 6.64759 11.3846 7.44643 11.3846C8.24527 11.3846 8.89286 10.7647 8.89286 10C8.89286 9.2353 8.24527 8.61538 7.44643 8.61538C6.64759 8.61538 6 9.2353 6 10ZM7.44643 16C6.64759 16 6 15.3801 6 14.6154C6 13.8507 6.64759 13.2308 7.44643 13.2308C8.24527 13.2308 8.89286 13.8507 8.89286 14.6154C8.89286 15.3801 8.24527 16 7.44643 16ZM11 5.38462C11 6.14932 11.6476 6.76923 12.4464 6.76923C13.2453 6.76923 13.8929 6.14932 13.8929 5.38462C13.8929 4.61991 13.2453 4 12.4464 4C11.6476 4 11 4.61991 11 5.38462ZM11 10C11 10.7647 11.6476 11.3846 12.4464 11.3846C13.2453 11.3846 13.8929 10.7647 13.8929 10C13.8929 9.2353 13.2453 8.61538 12.4464 8.61538C11.6476 8.61538 11 9.2353 11 10ZM12.4464 16C11.6476 16 11 15.3801 11 14.6154C11 13.8507 11.6476 13.2308 12.4464 13.2308C13.2453 13.2308 13.8929 13.8507 13.8929 14.6154C13.8929 15.3801 13.2453 16 12.4464 16Z" fill="#fff"></path></svg>
						<p className="text-white ml-2">Pane title</p>
					</div>
					<div className="p-4">
						{children}
					</div>
				</div>
			</div>
		</>
	)
}
