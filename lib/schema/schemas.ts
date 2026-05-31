import { Schema } from "./type"

export const SCHEMAS: Record<string, Schema> = {
    users: {
        name: { key: "name", label: "Name", type: "string" },
        age: { key: "age", label: "Age", type: "number" },
        status: {
            key: "status",
            label: "Status",
            type: "enum",
            enumValues: ["active", "inactive", "pending"],
        },
        country: { key: "country", label: "Country", type: "string" },
        email: { key: "email", label: "Email", type: "string" },
        purchases: { key: "purchases", label: "Purchases", type: "number" },
        createdAt: { key: "createdAt", label: "Created At", type: "date" },
    },
    products: {
        name: { key: "name", label: "Product Name", type: "string" },
        price: { key: "price", label: "Price", type: "number" },
        category: {
            key: "category",
            label: "Category",
            type: "enum",
            enumValues: ["electronics", "clothing", "food", "books", "sports"],
        },
        inStock: {
            key: "inStock",
            label: "In Stock",
            type: "boolean",
        },
        rating: { key: "rating", label: "Rating", type: "number" },
        createdAt: { key: "createdAt", label: "Created At", type: "date" },
    },
    orders: {
        orderId: { key: "orderId", label: "Order ID", type: "string" },
        amount: { key: "amount", label: "Amount", type: "number" },
        status: {
            key: "status",
            label: "Status",
            type: "enum",
            enumValues: ["pending", "processing", "shipped", "delivered", "cancelled"],
        },
        customerId: { key: "customerId", label: "Customer ID", type: "string" },
        createdAt: { key: "createdAt", label: "Created At", type: "date" },
    },
}

export const SCHEMA_NAMES = Object.keys(SCHEMAS)