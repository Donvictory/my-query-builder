"use client"
import { SchemaField, Operator } from "@/lib/schema/type"
import { ChevronDown } from "lucide-react"

interface Props {
    fieldDef: SchemaField | undefined
    operator: Operator
    value: any
    onChange: (value: any) => void
}

export function ValueInput({ fieldDef, operator, value, onChange }: Props) {
    if (!fieldDef) return null
    if (operator === "is_null" || operator === "is_not_null") return null

    // Range 'between' inputs
    if (operator === "between") {
        const val = Array.isArray(value) ? value : ["", ""]
        return (
            <div className="flex items-center gap-1.5 animate-fade-in">
                <input
                    type="number"
                    value={val[0]}
                    onChange={(e) => onChange([e.target.value, val[1]])}
                    className="w-18 h-[34px] text-sm px-2 border border-border/80 hover:border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                    placeholder="min"
                />
                <span className="text-sm text-muted-foreground font-semibold uppercase tracking-wider px-0.5">to</span>
                <input
                    type="number"
                    value={val[1]}
                    onChange={(e) => onChange([val[0], e.target.value])}
                    className="w-18 h-[34px] text-sm px-2 border border-border/80 hover:border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                    placeholder="max"
                />
            </div>
        )
    }

    // Array tags comma-input
    if (operator === "in_array") {
        return (
            <div className="relative flex items-center animate-fade-in w-full max-w-[200px]">
                <input
                    type="text"
                    value={Array.isArray(value) ? value.join(", ") : value}
                    onChange={(e) =>
                        onChange(e.target.value.split(",").map((v) => v.trim()))
                    }
                    className="w-full h-[34px] text-sm px-2.5 border border-border/80 hover:border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                    placeholder="val1, val2, val3..."
                />
            </div>
        )
    }

    switch (fieldDef.type) {
        case "number":
            return (
                <input
                    type="number"
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-24 h-[34px] text-sm px-2.5 border border-border/80 hover:border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium animate-fade-in"
                />
            )

        case "boolean":
            return (
                <div className="relative flex items-center h-[34px] border border-border/80 hover:border-border rounded-lg bg-background text-sm text-foreground w-20 transition-colors focus-within:ring-1 focus-within:ring-brand-primary/80 focus-within:border-brand-primary animate-fade-in">
                    <select
                        value={String(value)}
                        onChange={(e) => onChange(e.target.value === "true")}
                        className="appearance-none bg-transparent pr-7 pl-2.5 py-1 text-sm w-full font-semibold focus:outline-none cursor-pointer"
                    >
                        <option value="true">true</option>
                        <option value="false">false</option>
                    </select>
                    <span className="absolute right-2 text-muted-foreground/60 pointer-events-none">
                        <ChevronDown size={11} />
                    </span>
                </div>
            )

        case "enum":
            return (
                <div className="relative flex items-center h-[34px] w-36 border border-border/80 hover:border-border rounded-lg bg-background text-sm text-foreground transition-colors focus-within:ring-1 focus-within:ring-brand-primary/80 focus-within:border-brand-primary animate-fade-in">
                    <select
                        value={value ?? ""}
                        onChange={(e) => onChange(e.target.value)}
                        className="appearance-none bg-transparent pr-7 pl-2.5 py-1 text-sm w-full font-semibold focus:outline-none cursor-pointer"
                    >
                        <option value="">Select...</option>
                        {fieldDef.enumValues?.map((v) => (
                            <option key={v} value={v}>
                                {v}
                            </option>
                        ))}
                    </select>
                    <span className="absolute right-2 text-muted-foreground/60 pointer-events-none">
                        <ChevronDown size={11} />
                    </span>
                </div>
            )

        case "date":
            return (
                <div className="relative flex items-center w-36 animate-fade-in">
                    <input
                        type="date"
                        value={value ?? ""}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-[34px] text-sm pl-2.5 pr-7 border border-border/80 hover:border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-semibold"
                    />
                </div>
            )

        default:
            return (
                <input
                    type="text"
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-36 h-[34px] text-sm px-2.5 border border-border/80 hover:border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-semibold animate-fade-in"
                    placeholder="value..."
                />
            )
    }
}