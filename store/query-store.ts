import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { nanoid } from "nanoid"
import { QueryNode, QueryRule, QueryGroup, Schema, SavedPreset, ValidationError } from "@/lib/schema/type"
import { SCHEMAS } from "@/lib/schema/schemas"


function findAndMutate(
    node: QueryNode,
    targetId: string,
    mutate: (node: QueryNode) => void
): boolean {
    if (node.id === targetId) {
        mutate(node)
        return true
    }
    if (node.type === "group") {
        for (const child of node.children) {
            if (findAndMutate(child, targetId, mutate)) return true
        }
    }
    return false
}

function removeFromTree(
    node: QueryGroup,
    targetId: string
): QueryNode | null {
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]
        if (child.id === targetId) {
            node.children.splice(i, 1)
            return child
        }
        if (child.type === "group") {
            const found = removeFromTree(child, targetId)
            if (found) return found
        }
    }
    return null
}

function makeDefaultRule(schema: Schema): QueryRule {
    const firstField = Object.keys(schema)[0]
    return {
        type: "rule",
        id: nanoid(),
        field: firstField,
        operator: "equals",
        value: "",
    }
}

function makeDefaultGroup(schema: Schema): QueryGroup {
    return {
        type: "group",
        id: nanoid(),
        logic: "AND",
        children: [makeDefaultRule(schema)],
        collapsed: false,
    }
}

// --- Store Types ---
interface QueryStore {
    root: QueryGroup
    schema: Schema
    selectedSchema: string
    presets: SavedPreset[]
    history: QueryGroup[]
    historyIndex: number
    validationErrors: ValidationError[]
    hasExecuted: boolean
    isExecuting: boolean
    results: Record<string, any>[]
    darkMode: boolean
    toggleDarkMode: () => void

    addRule: (parentId: string) => void
    addGroup: (parentId: string) => void
    removeNode: (nodeId: string) => void
    updateRule: (nodeId: string, patch: Partial<QueryRule>) => void
    toggleLogic: (groupId: string) => void
    toggleCollapse: (groupId: string) => void
    moveNode: (nodeId: string, targetParentId: string, newIndex: number) => void


    setSchema: (schemaName: string) => void


    setResults: (results: Record<string, any>[]) => void
    setExecuting: (val: boolean) => void
    setValidationErrors: (errors: ValidationError[]) => void
    reset: () => void

    undo: () => void
    redo: () => void

    savePreset: (name: string) => void
    loadPreset: (presetId: string) => void
    deletePreset: (presetId: string) => void

    importQuery: (root: QueryGroup) => void
}

export const useQueryStore = create<QueryStore>()(
    persist(
        immer((set) => ({
            root: {
                type: "group",
                id: nanoid(),
                logic: "AND",
                children: [],
                collapsed: false,
            },
            schema: SCHEMAS.users,
            selectedSchema: "users",
            presets: [],
            history: [],
            historyIndex: -1,
            validationErrors: [],
            hasExecuted: false,
            isExecuting: false,
            results: [],
            darkMode: false,

            toggleDarkMode: () =>
                set((state) => {
                    state.darkMode = !state.darkMode
                    if (typeof document !== "undefined") {
                        document.documentElement.classList.toggle("dark", state.darkMode)
                    }
                }),

            addRule: (parentId) =>
                set((state) => {
                    findAndMutate(state.root, parentId, (node) => {
                        if (node.type === "group") {
                            node.children.push(makeDefaultRule(state.schema))
                        }
                    })
                }),

            addGroup: (parentId) =>
                set((state) => {
                    findAndMutate(state.root, parentId, (node) => {
                        if (node.type === "group") {
                            node.children.push(makeDefaultGroup(state.schema))
                        }
                    })
                }),

            removeNode: (nodeId) =>
                set((state) => {
                    removeFromTree(state.root, nodeId)
                }),

            updateRule: (nodeId, patch) =>
                set((state) => {
                    findAndMutate(state.root, nodeId, (node) => {
                        if (node.type === "rule") {
                            Object.assign(node, patch)

                            if (patch.field) {
                                node.value = ""
                                node.operator = "equals"
                            }
                        }
                    })
                }),

            toggleLogic: (groupId) =>
                set((state) => {
                    findAndMutate(state.root, groupId, (node) => {
                        if (node.type === "group") {
                            node.logic = node.logic === "AND" ? "OR" : "AND"
                        }
                    })
                }),

            toggleCollapse: (groupId) =>
                set((state) => {
                    findAndMutate(state.root, groupId, (node) => {
                        if (node.type === "group") {
                            node.collapsed = !node.collapsed
                        }
                    })
                }),

            moveNode: (nodeId, targetParentId, newIndex) =>
                set((state) => {
                    const extracted = removeFromTree(state.root, nodeId)
                    if (!extracted) return
                    findAndMutate(state.root, targetParentId, (node) => {
                        if (node.type === "group") {
                            node.children.splice(newIndex, 0, extracted)
                        }
                    })
                }),

            setSchema: (schemaName) =>
                set((state) => {
                    state.selectedSchema = schemaName
                    state.schema = SCHEMAS[schemaName]
                    state.root = {
                        type: "group",
                        id: nanoid(),
                        logic: "AND",
                        children: [],
                        collapsed: false,
                    }
                    state.results = []
                    state.validationErrors = []
                    state.hasExecuted = false
                }),

            setResults: (results) =>
                set((state) => {
                    state.results = results
                }),

            setExecuting: (val) =>
                set((state) => {
                    state.isExecuting = val
                }),

            setValidationErrors: (errors) =>
                set((state) => {
                    state.validationErrors = errors
                    state.hasExecuted = true
                }),

            reset: () =>
                set((state) => {
                    state.root = {
                        type: "group",
                        id: nanoid(),
                        logic: "AND",
                        children: [],
                        collapsed: false,
                    }
                    state.results = []
                    state.validationErrors = []
                    state.hasExecuted = false
                }),

            undo: () =>
                set((state) => {
                    if (state.historyIndex > 0) {
                        state.historyIndex -= 1
                        state.root = state.history[state.historyIndex]
                    }
                }),

            redo: () =>
                set((state) => {
                    if (state.historyIndex < state.history.length - 1) {
                        state.historyIndex += 1
                        state.root = state.history[state.historyIndex]
                    }
                }),

            savePreset: (name) =>
                set((state) => {
                    state.presets.push({
                        id: nanoid(),
                        name,
                        root: JSON.parse(JSON.stringify(state.root)),
                        createdAt: new Date().toISOString(),
                    })
                }),

            loadPreset: (presetId) =>
                set((state) => {
                    const preset = state.presets.find((p) => p.id === presetId)
                    if (preset) {
                        state.root = JSON.parse(JSON.stringify(preset.root))
                        state.results = []
                    }
                }),

            deletePreset: (presetId) =>
                set((state) => {
                    state.presets = state.presets.filter((p) => p.id !== presetId)
                }),

            importQuery: (root) =>
                set((state) => {
                    state.root = root
                    state.results = []
                    state.validationErrors = []
                }),
        })),
        {
            name: "query-builder-storage",
            partialize: (state) => ({
                presets: state.presets,
                selectedSchema: state.selectedSchema,
                root: state.root,
                darkMode: state.darkMode,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.results = []
                    state.isExecuting = false
                    state.validationErrors = []
                    if (typeof document !== "undefined") {
                        document.documentElement.classList.toggle("dark", state.darkMode)
                    }
                }
            },
        }
    )
)