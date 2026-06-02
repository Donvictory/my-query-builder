import { QueryGroup } from "./type"

export interface StarterPreset {
    id: string
    name: string
    description: string
    schema: string
    root: QueryGroup
}

export const STARTER_PRESETS: StarterPreset[] = [
    {
        id: "sp-1",
        name: "Active Nigerian Users",
        description: "AND logic, filter by two conditions",
        schema: "users",
        root: {
            type: "group",
            id: "sp1-root",
            logic: "AND",
            collapsed: false,
            children: [
                { type: "rule", id: "sp1-r1", field: "status", operator: "equals", value: "active" },
                { type: "rule", id: "sp1-r2", field: "country", operator: "equals", value: "Nigeria" },
            ],
        },
    },
    {
        id: "sp-2",
        name: "High-Value Customers",
        description: "Number comparison, purchases greater than 10 and status active",
        schema: "users",
        root: {
            type: "group",
            id: "sp2-root",
            logic: "AND",
            collapsed: false,
            children: [
                { type: "rule", id: "sp2-r1", field: "purchases", operator: "greater_than", value: 10 },
                { type: "rule", id: "sp2-r2", field: "status", operator: "equals", value: "active" },
            ],
        },
    },
    {
        id: "sp-3",
        name: "Young Active Users",
        description: "Between operator, find users aged 18 to 30 who are active",
        schema: "users",
        root: {
            type: "group",
            id: "sp3-root",
            logic: "AND",
            collapsed: false,
            children: [
                { type: "rule", id: "sp3-r1", field: "age", operator: "between", value: [18, 30] },
                { type: "rule", id: "sp3-r2", field: "status", operator: "equals", value: "active" },
            ],
        },
    },
    {
        id: "sp-4",
        name: "Affordable In-Stock Electronics",
        description: "Three conditions, category, price range, and boolean field",
        schema: "products",
        root: {
            type: "group",
            id: "sp4-root",
            logic: "AND",
            collapsed: false,
            children: [
                { type: "rule", id: "sp4-r1", field: "category", operator: "equals", value: "electronics" },
                { type: "rule", id: "sp4-r2", field: "price", operator: "less_than", value: 800 },
                { type: "rule", id: "sp4-r3", field: "inStock", operator: "equals", value: true },
            ],
        },
    },
    {
        id: "sp-5",
        name: "Top-Rated Books",
        description: "Multiple conditions on products, category and high rating",
        schema: "products",
        root: {
            type: "group",
            id: "sp5-root",
            logic: "AND",
            collapsed: false,
            children: [
                { type: "rule", id: "sp5-r1", field: "category", operator: "equals", value: "books" },
                { type: "rule", id: "sp5-r2", field: "rating", operator: "greater_than", value: 4.5 },
            ],
        },
    },
    {
        id: "sp-6",
        name: "Unresolved Orders",
        description: "OR logic, match rows where either condition is true",
        schema: "orders",
        root: {
            type: "group",
            id: "sp6-root",
            logic: "OR",
            collapsed: false,
            children: [
                { type: "rule", id: "sp6-r1", field: "status", operator: "equals", value: "pending" },
                { type: "rule", id: "sp6-r2", field: "status", operator: "equals", value: "processing" },
            ],
        },
    },
    {
        id: "sp-7",
        name: "Large Orders",
        description: "Nested groups, high-value orders that are not cancelled",
        schema: "orders",
        root: {
            type: "group",
            id: "sp7-root",
            logic: "AND",
            collapsed: false,
            children: [
                { type: "rule", id: "sp7-r1", field: "amount", operator: "greater_than", value: 500 },
                {
                    type: "group",
                    id: "sp7-g1",
                    logic: "OR",
                    collapsed: false,
                    children: [
                        { type: "rule", id: "sp7-r2", field: "status", operator: "equals", value: "delivered" },
                        { type: "rule", id: "sp7-r3", field: "status", operator: "equals", value: "shipped" },
                    ],
                },
            ],
        },
    },
]