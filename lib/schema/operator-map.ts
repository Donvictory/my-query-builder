import { FieldType, Operator } from "./type"

export const OPERATORS_BY_TYPE: Record<FieldType, Operator[]> = {
    string: ["equals", "not_equals", "contains", "starts_with", "is_null", "is_not_null"],
    number: ["equals", "not_equals", "greater_than", "less_than", "between", "is_null", "is_not_null"],
    date: ["equals", "not_equals", "greater_than", "less_than", "between", "is_null", "is_not_null"],
    enum: ["equals", "not_equals", "in_array", "is_null", "is_not_null"],
    boolean: ["equals", "not_equals"],
}

export const OPERATOR_LABELS: Record<Operator, string> = {
    equals: "equals",
    not_equals: "not equals",
    contains: "contains",
    starts_with: "starts with",
    greater_than: "greater than",
    less_than: "less than",
    in_array: "in array",
    between: "between",
    is_null: "is null",
    is_not_null: "is not null",
}