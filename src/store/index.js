import { create } from "zustand"

const useStore = create((set) => ({
    nodes: [],
    edges: [],
    dashboard: {},
    showUpgradeModal: false,
    showSidebar: false,
    activePanelElement: null,

    setShowSidebar: (show) => {
        set((state) => ({ showSidebar: show }))
    },

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

    setActivePanelElement: (el) => {
        set((state) => ({ activePanelElement: el }))
    },
}))

export default useStore
