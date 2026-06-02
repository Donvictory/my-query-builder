import { describe, it, expect } from "vitest"
import { validateNode } from "@/hooks/useQueryExport"
import { QueryGroup, QueryRule } from "@/lib/schema/type"

// ─── Rule validation ──────────────────────────────────────────────────────────

describe("validateNode — rules", () => {
    it("accepts a fully populated rule", () => {
        const rule: QueryRule = {
            type: "rule",
            id: "r1",
            field: "status",
            operator: "equals",
            value: "active",
        }
        expect(validateNode(rule)).toBe(true)
    })

    it("accepts a rule with numeric value 0", () => {
        const rule: QueryRule = {
            type: "rule",
            id: "r1",
            field: "age",
            operator: "equals",
            value: 0,
        }
        expect(validateNode(rule)).toBe(true)
    })

    it("accepts a rule with boolean false value", () => {
        const rule: QueryRule = {
            type: "rule",
            id: "r1",
            field: "inStock",
            operator: "equals",
            value: false,
        }
        expect(validateNode(rule)).toBe(true)
    })

    it("rejects a rule with empty field string", () => {
        const rule: QueryRule = {
            type: "rule",
            id: "r1",
            field: "",
            operator: "equals",
            value: "active",
        }
        expect(validateNode(rule)).toBe(false)
    })

    it("rejects a rule with empty operator string", () => {
        const rule: QueryRule = {
            type: "rule",
            id: "r1",
            field: "status",
            operator: "" as any,
            value: "active",
        }
        expect(validateNode(rule)).toBe(false)
    })

    it("rejects a rule with undefined value", () => {
        const rule = {
            type: "rule" as const,
            id: "r1",
            field: "status",
            operator: "equals" as const,
            value: undefined,
        }
        expect(validateNode(rule as any)).toBe(false)
    })

    it("accepts a rule with array value (between operator)", () => {
        const rule: QueryRule = {
            type: "rule",
            id: "r1",
            field: "age",
            operator: "between",
            value: [18, 30],
        }
        expect(validateNode(rule)).toBe(true)
    })
})

// ─── Group validation ─────────────────────────────────────────────────────────

describe("validateNode — groups", () => {
    it("accepts a group with AND logic and valid children", () => {
        const group: QueryGroup = {
            type: "group",
            id: "g1",
            logic: "AND",
            collapsed: false,
            children: [
                { type: "rule", id: "r1", field: "status", operator: "equals", value: "active" },
            ],
        }
        expect(validateNode(group)).toBe(true)
    })

    it("accepts a group with OR logic", () => {
        const group: QueryGroup = {
            type: "group",
            id: "g1",
            logic: "OR",
            collapsed: false,
            children: [
                { type: "rule", id: "r1", field: "status", operator: "equals", value: "active" },
            ],
        }
        expect(validateNode(group)).toBe(true)
    })

    it("accepts a group with empty children array", () => {
        const group: QueryGroup = {
            type: "group",
            id: "g1",
            logic: "AND",
            collapsed: false,
            children: [],
        }
        expect(validateNode(group)).toBe(true)
    })

    it("rejects a group with invalid logic value", () => {
        const group = {
            type: "group" as const,
            id: "g1",
            logic: "MAYBE" as any,
            collapsed: false,
            children: [],
        }
        expect(validateNode(group)).toBe(false)
    })

    it("rejects a group with non-array children", () => {
        const group = {
            type: "group" as const,
            id: "g1",
            logic: "AND" as const,
            collapsed: false,
            children: "not-an-array" as any,
        }
        expect(validateNode(group)).toBe(false)
    })

    it("rejects a group when a child rule is invalid", () => {
        const group = {
            type: "group" as const,
            id: "g1",
            logic: "AND" as const,
            collapsed: false,
            children: [
                { type: "rule" as const, id: "r1", field: "", operator: "equals" as const, value: "x" },
            ],
        }
        expect(validateNode(group)).toBe(false)
    })

    it("validates nested groups recursively", () => {
        const group: QueryGroup = {
            type: "group",
            id: "root",
            logic: "AND",
            collapsed: false,
            children: [
                {
                    type: "group",
                    id: "nested",
                    logic: "OR",
                    collapsed: false,
                    children: [
                        { type: "rule", id: "r1", field: "country", operator: "equals", value: "Nigeria" },
                        { type: "rule", id: "r2", field: "age", operator: "greater_than", value: 18 },
                    ],
                },
            ],
        }
        expect(validateNode(group)).toBe(true)
    })

    it("catches invalid rule deep inside nested groups", () => {
        const group: QueryGroup = {
            type: "group",
            id: "root",
            logic: "AND",
            collapsed: false,
            children: [
                {
                    type: "group",
                    id: "nested",
                    logic: "OR",
                    collapsed: false,
                    children: [
                        { type: "rule", id: "r1", field: "country", operator: "equals", value: "Nigeria" },
                        { type: "rule", id: "r2", field: "", operator: "equals", value: "bad" },
                    ],
                },
            ],
        }
        expect(validateNode(group)).toBe(false)
    })
})