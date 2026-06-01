// Core TypeScript types for the query builder
export type FieldType = "string" | "number" | "boolean" | "date" | "enum"

export type Operator =
    | "equals"
    | "not_equals"
    | "contains"
    | "starts_with"
    | "greater_than"
    | "less_than"
    | "in_array"
    | "between"
    | "is_null"
    | "is_not_null"

export interface SchemaField {
    key: string
    label: string
    type: FieldType
    enumValues?: string[]
}

export type Schema = Record<string, SchemaField>

export interface QueryRule {
    type: "rule"
    id: string
    field: string
    operator: Operator
    value: any
}

export interface QueryGroup {
    type: "group"
    id: string
    logic: "AND" | "OR"
    children: QueryNode[]
    collapsed?: boolean
}

export type QueryNode = QueryRule | QueryGroup

export interface SavedPreset {
    id: string
    name: string
    root: QueryGroup
    createdAt: string
}

export interface ValidationError {
    nodeId: string
    message: string
}