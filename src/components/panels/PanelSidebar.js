"use client"


export function PanelSidebar() {
	const onDragStart = (event, nodeType) => {
		event.dataTransfer.setData("application/reactflow", nodeType)
		event.dataTransfer.effectAllowed = "move"
	}

	return (
		<aside className="w-52 m-4">
			<div className=" bg-gray-200 rounded py-4 px-2 my-4" onDragStart={(event) => onDragStart(event, "defaultNode")} draggable>
				Input Node
			</div>
			<div className=" bg-gray-200 rounded py-4 px-2 my-4" onDragStart={(event) => onDragStart(event, "defaultNode")} draggable>
				Default Node
			</div>
			<div className=" bg-gray-200 rounded py-4 px-2 my-4" onDragStart={(event) => onDragStart(event, "defaultNode")} draggable>
				Output Node
			</div>
		</aside>
	)
}
