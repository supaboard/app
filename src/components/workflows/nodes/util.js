
export const deleteNode = () => {
    let index = data.id
    let updatedNodes = nodes.filter(node => node.id !== index)
    let updatedEdges = edges.filter(edge => edge.source !== index)

    // find all nodes that have this node as a parent and remove them
    updatedNodes.forEach(node => {
        if (node.parentNode == index || node.data.childOf == index) {
            updatedNodes = updatedNodes.filter(n => n.id !== node.id)
            updatedEdges = updatedEdges.filter(edge => edge.source !== node.id)

            if (node.type == "branchGroupNode") {
                let branchChildren = nodes.filter(n => n.parentNode == node.id)
                branchChildren.forEach(child => {
                    updatedNodes = updatedNodes.filter(n => n.id !== child.id)
                    updatedEdges = updatedEdges.filter(edge => edge.source !== child.id)
                })
            }
        }
    })


    setNodes(updatedNodes)
    setEdges(updatedEdges)
}




export const addButton = (type) => {
    setNodes([
        ...nodes,
        {
            id: (nodes.length + 1).toString(),
            type: "buttonNode",
            position: { x: 20, y: currentNode.current.clientHeight - 30 },
            data: { id: (nodes.length + 1).toString(), label: "Reply button", type: type, childOf: data.id },
            parentNode: data.id,
            extent: data.id,
            draggable: false,
            zIndex: 10,
            style: {
                width: 260,
                height: 45,
            }
        }])
    setEdges([...edges])
}


export const addNode = (action) => {
    setShowAddButtonMenu(false)
    let newId = (nodes.length + 1).toString()
    let parent = nodes.find(n => n.id == node.id)

    setNodes([
        ...nodes,
        {
            id: newId,
            type: "emptyNode",
            position: { x: 20, y: currentNode.current.clientHeight - 30 },
            data: {
                id: newId,
                type: action.type,
                childOf: data.id,
            },
            parentNode: data.id,
            extent: data.id,
            draggable: false,
            zIndex: 5,
            style: {
                width: 260,
                height: action.type == "message" ? 140 : 60,
            }
        }])
}

