import { describe, it, expect } from "vitest"
import { SCHEMAS } from "@/lib/schema/schemas"
import { QueryGroup, QueryRule } from "@/lib/schema/type"
import { generateMongo, generateFullSQL } from "@/lib/query-engine/generator"

const schema = SCHEMAS.users

const simpleRule: QueryRule = {
    type: "rule",
    id: "1",
    field: "age",
    operator: "greater_than",
    value: 18,
}

const simpleGroup: QueryGroup = {
    type: "group",
    id: "root",
    logic: "AND",
    children: [simpleRule],
}

const nestedGroup: QueryGroup = {
    type: "group",
    id: "root",
    logic: "AND",
    children: [
        { type: "rule", id: "2", field: "age", operator: "greater_than", value: 18 },
        { type: "rule", id: "3", field: "status", operator: "equals", value: "active" },
        {
            type: "group",
            id: "nested",
            logic: "OR",
            children: [
                { type: "rule", id: "4", field: "country", operator: "equals", value: "Nigeria" },
                { type: "rule", id: "5", field: "purchases", operator: "greater_than", value: 10 },
            ],
        },
    ],
}

describe("SQL Generator", () => {
    it("generates simple greater than rule", () => {
        const sql = generateFullSQL(simpleGroup, schema, "users")
        expect(sql).toContain('"age" > 18')
    })

    it("generates SELECT with table name", () => {
        const sql = generateFullSQL(simpleGroup, schema, "users")
        expect(sql).toContain("SELECT * FROM users")
    })

    it("generates AND logic correctly", () => {
        const sql = generateFullSQL(nestedGroup, schema, "users")
        expect(sql).toContain("AND")
    })

    it("generates nested OR group in parentheses", () => {
        const sql = generateFullSQL(nestedGroup, schema, "users")
        expect(sql).toContain("OR")
    })

    it("generates equals with string quotes", () => {
        const sql = generateFullSQL(simpleGroup, schema, "users")
        const group: QueryGroup = {
            type: "group",
            id: "r",
            logic: "AND",
            children: [
                { type: "rule", id: "x", field: "status", operator: "equals", value: "active" },
            ],
        }
        const result = generateFullSQL(group, schema, "users")
        expect(result).toContain("'active'")
    })

    it("returns SELECT without WHERE when no children", () => {
        const empty: QueryGroup = { type: "group", id: "e", logic: "AND", children: [] }
        expect(generateFullSQL(empty, schema, "users")).toBe("SELECT * FROM users")
    })

    it("generates is_null correctly", () => {
        const group: QueryGroup = {
            type: "group",
            id: "r",
            logic: "AND",
            children: [
                { type: "rule", id: "x", field: "age", operator: "is_null", value: null },
            ],
        }
        expect(generateFullSQL(group, schema, "users")).toContain("IS NULL")
    })
})

describe("Mongo Generator", () => {
    it("generates simple equals", () => {
        const group: QueryGroup = {
            type: "group",
            id: "r",
            logic: "AND",
            children: [
                { type: "rule", id: "x", field: "status", operator: "equals", value: "active" },
            ],
        }
        const result = generateMongo(group)

        expect(JSON.stringify(result)).toContain("active")
    })

    it("generates $gt for greater_than", () => {
        const result = generateMongo(simpleGroup)
        expect(JSON.stringify(result)).toContain("$gt")
    })

    it("generates nested $or", () => {
        const result = generateMongo(nestedGroup)
        expect(JSON.stringify(result)).toContain("$or")
    })
})