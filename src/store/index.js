import { create } from "zustand"

const useStore = create((set) => ({
    nodes: [],
    edges: [],
    dashboard: {},
    showUpgradeModal: false,

    setShowUpgradeModal: (show) => {
        set((state) => ({ showUpgradeModal: show }))
    },

    setDashboard: (dash) => {
        set((state) => ({ dashboard: dash }))
    },

    setNodes: (nds) => {
        set((state) => ({ nodes: nds }))
    },

    setEdges: (eds) => {
        set((state) => ({ edges: eds }))
    },
}))

export default useStore
