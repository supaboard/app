"use client"

import { useCallback, useRef } from "react"
import ReactFlow, { ReactFlowProvider, Background, Controls, addEdge, applyEdgeChanges, applyNodeChanges } from "reactflow"
import "reactflow/dist/style.css"
import useStore from "@/store/index"
import DefaultNode from "@/components/workflows/nodes/DefaultNode"
import BaseElement from "@/components/panels/BaseElement"
import { useEffect, useState } from "react"
import { PanelSidebar } from "@/components/panels/PanelSidebar"
import PanelInspector from "@/components/panels/PanelInspector"


const nodeTypes = {
	defaultNode: BaseElement,
}

export default function Workflows() {
	const { nodes, setNodes, edges, setEdges } = useStore()
	const reactFlowWrapper = useRef(null)
	const [flowInstance, setFlowInstance] = useState(null)

	const initFlow = async () => {
		let startingNode = {
			id: "start",
			type: "defaultNode",
			position: { x: 0, y: 0 },
			data: { id: "start", label: "This is the start of a conversation" },
			style: {
				width: 300,
				height: 200,
			},
			draggable: true,
            dragHandle: ".drag-pane",
		}

		setNodes([
			startingNode
		])
		setEdges([])
	}

	useEffect(() => {
		if (nodes?.length == 0) {
			initFlow()
		}
	}, [nodes])

	const onNodesChange = async (changes) => {
		let newNodes = applyNodeChanges(changes, nodes)
		setNodes(newNodes)
	}

	const onEdgesChange = async (changes) => {
		let newEdges = applyEdgeChanges(changes, edges)
		setEdges(newEdges)
	}

	const onConnect = async (connection) => {
		let newEdges = addEdge(connection, edges)
		setEdges(newEdges)
	}

	const onDragOver = useCallback((event) => {
		event.preventDefault()
		event.dataTransfer.dropEffect = "move"
	}, [])

	const onDrop = async (event) => {
		event.preventDefault()

		const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
		const type = event.dataTransfer.getData("application/reactflow")

		if (type == "chartNode") {

		}
		if (type == "tableNode") {

		}
		if (type == "buttonNode") {

		}

		// check if the dropped element is valid
		if (typeof type === "undefined" || !type) {
			return
		}

		const position = flowInstance.project({
			x: event.clientX - reactFlowBounds.left,
			y: event.clientY - reactFlowBounds.top,
		});

		let newNode = {
			id: (nodes.length + 1).toString(),
			type: "defaultNode",
			position,
			data: {
				id: "dragged",
				label: type
			},
			draggable: true,
		}

		setNodes([...nodes, newNode])
		setEdges([])
	}

	return (
		<div className="flex">
			<PanelSidebar />
			<div className="grow">
				<div className="w-full h-[calc(100vh_-_63px)]">
					<ReactFlowProvider>
						<div className="bg-gray-50 w-full h-[calc(100vh_-_63px)]" ref={reactFlowWrapper}>
							<ReactFlow
								nodes={nodes}
								edges={edges}
								onNodesChange={onNodesChange}
								onEdgesChange={onEdgesChange}
								onConnect={onConnect}
								nodeTypes={nodeTypes}
								onInit={setFlowInstance}
								onDrop={onDrop}
								onDragOver={onDragOver}
								fitView
								maxZoom={1}
								snapGrid={[20, 20]}
								snapToGrid={true}
								panOnDrag={false}
								preventScrolling={true}
								zoomOnScroll={false}
							>
								<Controls />
								<Background variant="lines" gap={20} size={1} color="#efefef" />
							</ReactFlow>
						</div>
					</ReactFlowProvider>
				</div>
				<PanelInspector />
			</div>
		</div>
	)
}
