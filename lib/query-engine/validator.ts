import { QueryNode, QueryGroup, Schema, ValidationError } from "@/lib/schema/type"
import { OPERATORS_BY_TYPE } from "@/lib/schema/operator-map"

export function validateTree(
    node: QueryNode,
    schema: Schema
): ValidationError[] {
    const errors: ValidationError[] = []

    if (node.type === "rule") {
        const fieldDef = schema[node.field]
        if (!fieldDef) {
            errors.push({ nodeId: node.id, message: `Field "${node.field}" not found in schema` })
            return errors
        }

        const allowed = OPERATORS_BY_TYPE[fieldDef.type]
        if (!allowed.includes(node.operator)) {
            errors.push({
                nodeId: node.id,
                message: `"${node.operator}" is not valid for ${fieldDef.type} fields`,
            })
        }

        if (!["is_null", "is_not_null"].includes(node.operator)) {
            if (node.value === "" || node.value === null || node.value === undefined) {
                errors.push({ nodeId: node.id, message: "Value is required" })
            }
        }

        if (node.operator === "between") {
            if (!Array.isArray(node.value) || node.value.length !== 2) {
                errors.push({ nodeId: node.id, message: "Between requires two values" })
            }
        }

        return errors
    }

    if (node.children.length === 0) {
        errors.push({ nodeId: node.id, message: "Group cannot be empty" })
        return errors
    }

    for (const child of node.children) {
        errors.push(...validateTree(child, schema))
    }

    return errors
}

export function isValidTree(root: QueryGroup, schema: Schema): boolean {
    return validateTree(root, schema).length === 0
}