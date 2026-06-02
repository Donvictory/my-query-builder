import { describe, it, expect, beforeEach } from "vitest"
import { useQueryStore } from "@/store/query-store"
import { SCHEMAS } from "@/lib/schema/schemas"
import { QueryGroup } from "@/lib/schema/type"

const CLEAN_ROOT: QueryGroup = {
    type: "group",
    id: "root-test",
    logic: "AND",
    children: [],
    collapsed: false,
}

beforeEach(() => {
    localStorage.clear()
    useQueryStore.setState({
        root: { ...CLEAN_ROOT },
        schema: SCHEMAS.users,
        selectedSchema: "users",
        presets: [],
        history: [],
        historyIndex: -1,
        validationErrors: [],
        hasExecuted: false,
        isExecuting: false,
        results: [],
    })
})

// ─── reset ────────────────────────────────────────────────────────────────────

describe("Store — reset", () => {
    it("clears root children", () => {
        useQueryStore.getState().addRule("root-test")
        useQueryStore.getState().reset()
        expect(useQueryStore.getState().root.children).toHaveLength(0)
    })

    it("clears results and hasExecuted", () => {
        useQueryStore.setState({ results: [{ name: "Alice" }], hasExecuted: true })
        useQueryStore.getState().reset()
        expect(useQueryStore.getState().results).toHaveLength(0)
        expect(useQueryStore.getState().hasExecuted).toBe(false)
    })
})

// ─── addRule ──────────────────────────────────────────────────────────────────

describe("Store — addRule", () => {
    it("adds a rule to the root group", () => {
        useQueryStore.getState().addRule("root-test")
        expect(useQueryStore.getState().root.children).toHaveLength(1)
        expect(useQueryStore.getState().root.children[0].type).toBe("rule")
    })

    it("adds multiple rules independently", () => {
        useQueryStore.getState().addRule("root-test")
        useQueryStore.getState().addRule("root-test")
        expect(useQueryStore.getState().root.children).toHaveLength(2)
    })

    it("does nothing when parentId does not exist", () => {
        useQueryStore.getState().addRule("nonexistent-id")
        expect(useQueryStore.getState().root.children).toHaveLength(0)
    })
})

// ─── addGroup ─────────────────────────────────────────────────────────────────

describe("Store — addGroup", () => {
    it("adds a nested group inside root", () => {
        useQueryStore.getState().addGroup("root-test")
        const child = useQueryStore.getState().root.children[0]
        expect(child.type).toBe("group")
    })

    it("nested group has one default rule", () => {
        useQueryStore.getState().addGroup("root-test")
        const nested = useQueryStore.getState().root.children[0] as QueryGroup
        expect(nested.children).toHaveLength(1)
    })
})

// ─── removeNode ───────────────────────────────────────────────────────────────

describe("Store — removeNode", () => {
    it("removes a rule from the root group", () => {
        useQueryStore.getState().addRule("root-test")
        const ruleId = useQueryStore.getState().root.children[0].id
        useQueryStore.getState().removeNode(ruleId)
        expect(useQueryStore.getState().root.children).toHaveLength(0)
    })

    it("removes a deeply nested rule", () => {
        useQueryStore.getState().addGroup("root-test")
        const nested = useQueryStore.getState().root.children[0] as QueryGroup
        const deepRuleId = nested.children[0].id
        useQueryStore.getState().removeNode(deepRuleId)
        const updatedNested = useQueryStore.getState().root.children[0] as QueryGroup
        expect(updatedNested.children).toHaveLength(0)
    })
})

// ─── toggleLogic ──────────────────────────────────────────────────────────────

describe("Store — toggleLogic", () => {
    it("switches AND to OR", () => {
        useQueryStore.getState().toggleLogic("root-test")
        expect(useQueryStore.getState().root.logic).toBe("OR")
    })

    it("switches OR back to AND", () => {
        useQueryStore.getState().toggleLogic("root-test")
        useQueryStore.getState().toggleLogic("root-test")
        expect(useQueryStore.getState().root.logic).toBe("AND")
    })
})

// ─── updateRule ───────────────────────────────────────────────────────────────

describe("Store — updateRule", () => {
    it("updates the value of a rule", () => {
        useQueryStore.getState().addRule("root-test")
        const ruleId = useQueryStore.getState().root.children[0].id
        useQueryStore.getState().updateRule(ruleId, { value: "Nigeria" })
        const rule = useQueryStore.getState().root.children[0] as any
        expect(rule.value).toBe("Nigeria")
    })

    it("changing field resets value and operator", () => {
        useQueryStore.getState().addRule("root-test")
        const ruleId = useQueryStore.getState().root.children[0].id
        useQueryStore.getState().updateRule(ruleId, { value: "some-value" })
        useQueryStore.getState().updateRule(ruleId, { field: "email" })
        const rule = useQueryStore.getState().root.children[0] as any
        expect(rule.value).toBe("")
        expect(rule.operator).toBe("equals")
    })
})

// ─── undo / redo ──────────────────────────────────────────────────────────────

describe("Store — undo / redo", () => {
    it("undo does nothing when history is empty", () => {
        useQueryStore.getState().undo()
        expect(useQueryStore.getState().historyIndex).toBe(-1)
    })

    it("redo does nothing when at end of history", () => {
        const snap: QueryGroup = { ...CLEAN_ROOT, id: "snap" }
        useQueryStore.setState({ history: [snap], historyIndex: 0, root: snap })
        useQueryStore.getState().redo()
        expect(useQueryStore.getState().historyIndex).toBe(0)
    })

    it("undo navigates back through history", () => {
        const v1: QueryGroup = { ...CLEAN_ROOT, id: "v1", logic: "AND" }
        const v2: QueryGroup = { ...CLEAN_ROOT, id: "v2", logic: "OR" }
        useQueryStore.setState({ history: [v1, v2], historyIndex: 1, root: v2 })
        useQueryStore.getState().undo()
        expect(useQueryStore.getState().historyIndex).toBe(0)
        expect(useQueryStore.getState().root.id).toBe("v1")
    })

    it("redo moves forward after undo", () => {
        const v1: QueryGroup = { ...CLEAN_ROOT, id: "v1" }
        const v2: QueryGroup = { ...CLEAN_ROOT, id: "v2" }
        useQueryStore.setState({ history: [v1, v2], historyIndex: 0, root: v1 })
        useQueryStore.getState().redo()
        expect(useQueryStore.getState().historyIndex).toBe(1)
        expect(useQueryStore.getState().root.id).toBe("v2")
    })
})

// ─── presets ──────────────────────────────────────────────────────────────────

describe("Store — presets", () => {
    it("savePreset stores the current root with a name", () => {
        useQueryStore.getState().savePreset("My Filter")
        const { presets } = useQueryStore.getState()
        expect(presets).toHaveLength(1)
        expect(presets[0].name).toBe("My Filter")
    })

    it("loadPreset replaces root with saved root", () => {
        useQueryStore.getState().addRule("root-test")
        useQueryStore.getState().savePreset("With Rule")
        useQueryStore.getState().reset()
        expect(useQueryStore.getState().root.children).toHaveLength(0)

        const presetId = useQueryStore.getState().presets[0].id
        useQueryStore.getState().loadPreset(presetId)
        expect(useQueryStore.getState().root.children).toHaveLength(1)
    })

    it("deletePreset removes it from the list", () => {
        useQueryStore.getState().savePreset("Temp")
        const presetId = useQueryStore.getState().presets[0].id
        useQueryStore.getState().deletePreset(presetId)
        expect(useQueryStore.getState().presets).toHaveLength(0)
    })

    it("loadPreset does nothing for unknown id", () => {
        useQueryStore.getState().addRule("root-test")
        useQueryStore.getState().loadPreset("nonexistent")
        expect(useQueryStore.getState().root.children).toHaveLength(1)
    })
})

// ─── importQuery ──────────────────────────────────────────────────────────────

describe("Store — importQuery", () => {
    it("replaces root with imported query", () => {
        const imported: QueryGroup = {
            type: "group",
            id: "imported-root",
            logic: "OR",
            collapsed: false,
            children: [
                { type: "rule", id: "r1", field: "status", operator: "equals", value: "active" },
            ],
        }
        useQueryStore.getState().importQuery(imported)
        expect(useQueryStore.getState().root.logic).toBe("OR")
        expect(useQueryStore.getState().root.children).toHaveLength(1)
    })

    it("clears results and validationErrors on import", () => {
        useQueryStore.setState({ results: [{ name: "test" }], validationErrors: [{ nodeId: "x", message: "err" }] })
        useQueryStore.getState().importQuery({ ...CLEAN_ROOT })
        expect(useQueryStore.getState().results).toHaveLength(0)
        expect(useQueryStore.getState().validationErrors).toHaveLength(0)
    })

    it("deep clones imported root — external mutation does not affect store", () => {
        const imported: QueryGroup = { ...CLEAN_ROOT, logic: "AND" }
        useQueryStore.getState().importQuery(imported)
        ;(imported as any).logic = "OR"
        expect(useQueryStore.getState().root.logic).toBe("AND")
    })
})

// ─── setSchema ────────────────────────────────────────────────────────────────

describe("Store — setSchema", () => {
    it("switches to products schema", () => {
        useQueryStore.getState().setSchema("products")
        expect(useQueryStore.getState().selectedSchema).toBe("products")
        expect(useQueryStore.getState().schema).toEqual(SCHEMAS.products)
    })

    it("resets root and results when switching schema", () => {
        useQueryStore.getState().addRule("root-test")
        useQueryStore.setState({ results: [{ name: "x" }] })
        useQueryStore.getState().setSchema("orders")
        expect(useQueryStore.getState().root.children).toHaveLength(0)
        expect(useQueryStore.getState().results).toHaveLength(0)
    })
})