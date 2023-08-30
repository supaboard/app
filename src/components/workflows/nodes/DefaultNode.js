import { useState, useEffect, useRef } from "react"
import { EllipsisHorizontalIcon, PlayIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import { Handle, Position } from "reactflow"

import store from "@/store"

export default function DefaultNode({ data }) {
    const { nodes, setNodes, edges, setEdges } = store()
    const currentNode = useRef(null)
    
    let node = nodes.find(node => node.id == data.id)
    if (!node) {
        node = data
    }

    const addNode = () => {
        let newId = (nodes.length + 1).toString()
        let parent = nodes.find(n => n.id == node.parentNode)
        if (!parent) {
            parent = node
        }

        setNodes([
            ...nodes,
            {
                id: newId,
                type: "defaultNode",
                position: { x: parent.position.x + 400, y: parent.position.y + 100 },
                draggable: true,
                data: { id: newId, label: "This is a new node" },
            }])

        setEdges([
            ...edges,
            {
                id: `e${newId}`,
                source: data.id.toString(),
                target: newId,
                targetHandle: "a",
                type: "smoothstep",
            }])
    }


    return (
        <div
            className="bg-white border border-gray-200 rounded-lg relative w-[300px] p-0.5 drop-shadow"
            style={{ height: 200 + "px" }}
        >
            <div className="bg-gray-100 border-b border-gray-200 rounded-t-md relative">
                <div className="flex items-center gap-x-2">
                    <div className="grow m-2">
                        {node.id == "start" && (
                            <PlayIcon className="w-5 h-5" />
                        )}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 p-2">
                        <EllipsisHorizontalIcon className="w-5 h-5" />
                    </button>
                    <button
                        className="text-gray-400 hover:text-gray-600 rounded-tr-md p-2 bg-gray-200"
                        onClick={() => {
                            addNode()
                        }}
                    >
                        <PlusIcon className="w-5 h-5" />
                    </button>                    
                </div>
                <Handle type="source" position={Position.Right} className="opacity-0 absolute !-right-2 !top-4 !w-3 !h-3 !bg-sky-200 !border-2 !border-sky-400 !rounded-full !p-0 !m-0" />
            </div>

            <div className="p-4 flex items-center gap-x-2">
                Start here
                <div className="relative">
                    ...
                </div>
            </div>
            {node.id != "start" && (
                <Handle type="target" position={Position.Left}  className="opacity-0 absolute !-left-2 !top-5 !w-3 !h-3 !bg-sky-200 !border-2 !border-sky-400 !rounded-full !p-0 !m-0"/>
            )}
        </div>
    )
}