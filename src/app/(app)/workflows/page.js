"use client"

import ReactFlow, { ReactFlowProvider, Background, Controls, addEdge, applyEdgeChanges, applyNodeChanges } from "reactflow"
import "reactflow/dist/style.css"
import useStore from "@/store/index"
import DefaultNode from "@/components/workflows/nodes/DefaultNode"
import { useEffect, useState } from "react"


const nodeTypes = {
    defaultNode: DefaultNode,
}

export default function Workflows() {
    const { nodes, setNodes, edges, setEdges } = useStore()
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

    return (
        <div className="w-screen h-[calc(100vh_-_63px)]">
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    onInit={setFlowInstance}
                    fitView
                    maxZoom={1}
                >
                    <Controls />
                    <Background variant="dots" gap={12} size={1} color="#cecece" />
                </ReactFlow>
                </ReactFlowProvider>
        </div>
    )
}
