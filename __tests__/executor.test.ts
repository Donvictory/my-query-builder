import { describe, it, expect } from "vitest"
import { executeQuery } from "@/lib/query-engine/executor"
import { QueryGroup } from "@/lib/schema/type"
import { MOCK_DATA } from "@/lib/schema/mock-data"

const dataset = MOCK_DATA.users

describe("Query Executor", () => {
    it("returns all rows when group is empty", () => {
        const root: QueryGroup = { type: "group", id: "r", logic: "AND", children: [] }
        expect(executeQuery(root, dataset)).toHaveLength(dataset.length)
    })

    it("filters by age greater than 30", () => {
        const root: QueryGroup = {
            type: "group",
            id: "r",
            logic: "AND",
            children: [
                { type: "rule", id: "1", field: "age", operator: "greater_than", value: 30 },
            ],
        }
        const results = executeQuery(root, dataset)
        expect(results.every((r) => r.age > 30)).toBe(true)
    })

    it("filters by status equals active", () => {
        const root: QueryGroup = {
            type: "group",
            id: "r",
            logic: "AND",
            children: [
                { type: "rule", id: "1", field: "status", operator: "equals", value: "active" },
            ],
        }
        const results = executeQuery(root, dataset)
        expect(results.every((r) => r.status === "active")).toBe(true)
    })

    it("handles AND logic correctly", () => {
        const root: QueryGroup = {
            type: "group",
            id: "r",
            logic: "AND",
            children: [
                { type: "rule", id: "1", field: "status", operator: "equals", value: "active" },
                { type: "rule", id: "2", field: "country", operator: "equals", value: "Nigeria" },
            ],
        }
        const results = executeQuery(root, dataset)
        expect(results.every((r) => r.status === "active" && r.country === "Nigeria")).toBe(true)
    })

    it("handles OR logic correctly", () => {
        const root: QueryGroup = {
            type: "group",
            id: "r",
            logic: "OR",
            children: [
                { type: "rule", id: "1", field: "country", operator: "equals", value: "Nigeria" },
                { type: "rule", id: "2", field: "country", operator: "equals", value: "Ghana" },
            ],
        }
        const results = executeQuery(root, dataset)
        expect(results.every((r) => r.country === "Nigeria" || r.country === "Ghana")).toBe(true)
    })

    it("returns empty array when no matches", () => {
        const root: QueryGroup = {
            type: "group",
            id: "r",
            logic: "AND",
            children: [
                { type: "rule", id: "1", field: "country", operator: "equals", value: "Mars" },
            ],
        }
        expect(executeQuery(root, dataset)).toHaveLength(0)
    })

    it("handles nested groups", () => {
        const root: QueryGroup = {
            type: "group",
            id: "r",
            logic: "AND",
            children: [
                { type: "rule", id: "1", field: "age", operator: "greater_than", value: 18 },
                {
                    type: "group",
                    id: "nested",
                    logic: "OR",
                    children: [
                        { type: "rule", id: "2", field: "country", operator: "equals", value: "Nigeria" },
                        { type: "rule", id: "3", field: "purchases", operator: "greater_than", value: 20 },
                    ],
                },
            ],
        }
        const results = executeQuery(root, dataset)
        expect(results.length).toBeGreaterThan(0)
        expect(results.every((r) => r.age > 18)).toBe(true)
    })
})