import { QueryNode, QueryRule, QueryGroup, Schema } from "@/lib/schema/type"

function formatValue(value: any, type: string): string {
    if (type === "string" || type === "enum" || type === "date") {
        return `'${value}'`
    }
    return String(value)
}

function generateSQLRule(rule: QueryRule, schema: Schema): string {
    const field = `"${rule.field}"`
    const fieldDef = schema[rule.field]
    const type = fieldDef?.type ?? "string"

    switch (rule.operator) {
        case "equals":
            return `${field} = ${formatValue(rule.value, type)}`
        case "not_equals":
            return `${field} != ${formatValue(rule.value, type)}`
        case "contains":
            return `${field} LIKE '%${rule.value}%'`
        case "starts_with":
            return `${field} LIKE '${rule.value}%'`
        case "greater_than":
            return `${field} > ${rule.value}`
        case "less_than":
            return `${field} < ${rule.value}`
        case "between":
            return `${field} BETWEEN ${rule.value?.[0]} AND ${rule.value?.[1]}`
        case "in_array":
            const vals = Array.isArray(rule.value)
                ? rule.value.map((v: any) => formatValue(v, type)).join(", ")
                : ""
            return `${field} IN (${vals})`
        case "is_null":
            return `${field} IS NULL`
        case "is_not_null":
            return `${field} IS NOT NULL`
        default:
            return ""
    }
}

export function generateSQL(node: QueryNode, schema: Schema, depth = 0): string {
    if (node.type === "rule") {
        return generateSQLRule(node, schema)
    }

    const parts = node.children
        .map((child) => generateSQL(child, schema, depth + 1))
        .filter(Boolean)

    if (parts.length === 0) return ""
    if (parts.length === 1) return parts[0]

    const joined = parts.join(`\n${" ".repeat(depth * 2)}${node.logic} `)
    return depth > 0 ? `(\n${" ".repeat(depth * 2)}${joined}\n${" ".repeat((depth - 1) * 2)})` : joined
}

export function generateFullSQL(root: QueryGroup, schema: Schema, tableName: string): string {
    const where = generateSQL(root, schema, 0)
    if (!where) return `SELECT * FROM ${tableName}`
    return `SELECT * FROM ${tableName}\nWHERE ${where}`
}


function generateMongoRule(rule: QueryRule): Record<string, any> {
    switch (rule.operator) {
        case "equals":
            return { [rule.field]: rule.value }
        case "not_equals":
            return { [rule.field]: { $ne: rule.value } }
        case "contains":
            return { [rule.field]: { $regex: rule.value, $options: "i" } }
        case "starts_with":
            return { [rule.field]: { $regex: `^${rule.value}`, $options: "i" } }
        case "greater_than":
            return { [rule.field]: { $gt: Number(rule.value) } }
        case "less_than":
            return { [rule.field]: { $lt: Number(rule.value) } }
        case "between":
            return {
                [rule.field]: {
                    $gte: Number(rule.value?.[0]),
                    $lte: Number(rule.value?.[1]),
                },
            }
        case "in_array":
            return { [rule.field]: { $in: Array.isArray(rule.value) ? rule.value : [] } }
        case "is_null":
            return { [rule.field]: null }
        case "is_not_null":
            return { [rule.field]: { $ne: null } }
        default:
            return {}
    }
}

export function generateMongo(node: QueryNode): Record<string, any> {
    if (node.type === "rule") {
        return generateMongoRule(node)
    }

    const children = node.children
        .map((child) => generateMongo(child))
        .filter((c) => Object.keys(c).length > 0)

    if (children.length === 0) return {}
    if (children.length === 1) return children[0]

    return { [`$${node.logic.toLowerCase()}`]: children }
}