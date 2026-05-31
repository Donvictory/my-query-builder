import { describe, it, expect } from "vitest"
import { validateTree, isValidTree } from "@/lib/query-engine/validator"
import { QueryGroup } from "@/lib/schema/type"
import { SCHEMAS } from "@/lib/schema/schemas"

const schema = SCHEMAS.users

describe("Validator", () => {
    it("passes a valid rule", () => {
        const root: QueryGroup = {
            type: "group",
            id: "r",
            logic: "AND",
            children: [
                { type: "rule", id: "1", field: "age", operator: "greater_than", value: 18 },
            ],
        }
        expect(validateTree(root, schema)).toHaveLength(0)
    })

    it("flags empty group", () => {
        const root: QueryGroup = { type: "group", id: "r", logic: "AND", children: [] }
        const errors = validateTree(root, schema)
        expect(errors.some((e) => e.message === "Group cannot be empty")).toBe(true)
    })

    it("flags missing value", () => {
        const root: QueryGroup = {
            type: "group",
            id: "r",
            logic: "AND",
            children: [
                { type: "rule", id: "1", field: "age", operator: "greater_than", value: "" },
            ],
        }
        const errors = validateTree(root, schema)
        expect(errors.some((e) => e.message === "Value is required")).toBe(true)
    })

    it("flags contains operator on number field", () => {
        const root: QueryGroup = {
            type: "group",
            id: "r",
            logic: "AND",
            children: [
                { type: "rule", id: "1", field: "age", operator: "contains" as any, value: "18" },
            ],
        }
        const errors = validateTree(root, schema)
        expect(errors.length).toBeGreaterThan(0)
    })

    it("flags between with wrong value format", () => {
        const root: QueryGroup = {
            type: "group",
            id: "r",
            logic: "AND",
            children: [
                { type: "rule", id: "1", field: "age", operator: "between", value: "notanarray" },
            ],
        }
        const errors = validateTree(root, schema)
        expect(errors.some((e) => e.message === "Between requires two values")).toBe(true)
    })

    it("isValidTree returns true for valid query", () => {
        const root: QueryGroup = {
            type: "group",
            id: "r",
            logic: "AND",
            children: [
                { type: "rule", id: "1", field: "status", operator: "equals", value: "active" },
            ],
        }
        expect(isValidTree(root, schema)).toBe(true)
    })
})