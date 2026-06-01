import { QueryGroup, QueryRule, QueryNode } from "@/lib/schema/type"

function matchesRule(rule: QueryRule, row: Record<string, any>): boolean {
    const val = row[rule.field]
    const ruleVal = rule.value

    switch (rule.operator) {
        case "equals":
            return String(val).toLowerCase() === String(ruleVal).toLowerCase()
        case "not_equals":
            return String(val).toLowerCase() !== String(ruleVal).toLowerCase()
        case "contains":
            return String(val).toLowerCase().includes(String(ruleVal).toLowerCase())
        case "starts_with":
            return String(val).toLowerCase().startsWith(String(ruleVal).toLowerCase())
        case "greater_than":
            return Number(val) > Number(ruleVal)
        case "less_than":
            return Number(val) < Number(ruleVal)
        case "between":
            return (
                Array.isArray(ruleVal) &&
                Number(val) >= Number(ruleVal[0]) &&
                Number(val) <= Number(ruleVal[1])
            )
        case "in_array":
            return Array.isArray(ruleVal) && ruleVal.includes(val)
        case "is_null":
            return val === null || val === undefined || val === ""
        case "is_not_null":
            return val !== null && val !== undefined && val !== ""
        default:
            return true
    }
}

function matchesNode(node: QueryNode, row: Record<string, any>): boolean {
    if (node.type === "rule") {
        return matchesRule(node, row)
    }

    if (node.children.length === 0) return true

    const results = node.children.map((child) => matchesNode(child, row))

    return node.logic === "AND"
        ? results.every(Boolean)
        : results.some(Boolean)
}

export function executeQuery(
    root: QueryGroup,
    dataset: Record<string, any>[]
): Record<string, any>[] {
    if (root.children.length === 0) return dataset
    return dataset.filter((row) => matchesNode(root, row))
}