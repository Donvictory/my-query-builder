"use client"

import { Input } from "@/components/ui/input"
import { SchemaField, Operator } from "@/lib/schema/type"

interface Props {
    fieldDef: SchemaField | undefined
    operator: Operator
    value: any
    onChange: (value: any) => void
}

export function ValueInput({ fieldDef, operator, value, onChange }: Props) {
    if (!fieldDef) return null
    if (operator === "is_null" || operator === "is_not_null") return null

    if (operator === "between") {
        const val = Array.isArray(value) ? value : ["", ""]
        return (
            <div className="flex items-center gap-1">
                <Input
                    type="number"
                    value={val[0]}
                    onChange={(e) => onChange([e.target.value, val[1]])}
                    className="w-20 h-7 text-xs"
                    placeholder="min"
                />
                <span className="text-xs text-muted-foreground">and</span>
                <Input
                    type="number"
                    value={val[1]}
                    onChange={(e) => onChange([val[0], e.target.value])}
                    className="w-20 h-7 text-xs"
                    placeholder="max"
                />
            </div>
        )
    }

    if (operator === "in_array") {
        return (
            <Input
                type="text"
                value={Array.isArray(value) ? value.join(", ") : value}
                onChange={(e) =>
                    onChange(e.target.value.split(",").map((v) => v.trim()))
                }
                className="w-40 h-7 text-xs"
                placeholder="val1, val2, val3"
            />
        )
    }

    switch (fieldDef.type) {
        case "number":
            return (
                <Input
                    type="number"
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-24 h-7 text-xs"
                />
            )

        case "boolean":
            return (
                <select
                    value={String(value)}
                    onChange={(e) => onChange(e.target.value === "true")}
                    className="h-7 text-xs border rounded-md px-2 bg-background"
                >
                    <option value="true">true</option>
                    <option value="false">false</option>
                </select>
            )

        case "enum":
            return (
                <select
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-7 text-xs border rounded-md px-2 bg-background"
                >
                    <option value="">Select...</option>
                    {fieldDef.enumValues?.map((v) => (
                        <option key={v} value={v}>
                            {v}
                        </option>
                    ))}
                </select>
            )

        case "date":
            return (
                <Input
                    type="date"
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-36 h-7 text-xs"
                />
            )

        default:
            return (
                <Input
                    type="text"
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-32 h-7 text-xs"
                    placeholder="value..."
                />
            )
    }
}