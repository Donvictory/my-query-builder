"use client"

import { useQueryStore } from "@/store/query-store"
import { SCHEMA_NAMES } from "@/lib/schema/schemas"


const TYPE_COLORS: Record<string, string> = {
    string: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    number: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    enum: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    date: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    boolean: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
}

export function SchemaPanel() {
    const schema = useQueryStore((s) => s.schema)
    const selectedSchema = useQueryStore((s) => s.selectedSchema)
    const setSchema = useQueryStore((s) => s.setSchema)
    const errors = useQueryStore((s) => s.validationErrors)

    return (
        <div className="border rounded-lg p-4 bg-background">
            {/* Schema switcher */}
            <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Data source
                </p>
                <div className="flex gap-2 flex-wrap">
                    {SCHEMA_NAMES.map((name) => (
                        <button
                            key={name}
                            onClick={() => setSchema(name)}
                            className={`text-xs px-3 py-1 rounded-full border transition-colors ${selectedSchema === name
                                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
                                : "text-muted-foreground border-border hover:bg-muted"
                                }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Fields */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Schema fields
            </p>
            <div className="flex flex-col gap-1">
                {Object.values(schema).map((field) => (
                    <div
                        key={field.key}
                        className="flex items-center justify-between text-xs py-1.5 border-b last:border-0"
                    >
                        <span className="text-foreground">{field.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${TYPE_COLORS[field.type]}`}>
                            {field.type}
                        </span>
                    </div>
                ))}
            </div>

            {/* Validation */}
            <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Validation
                </p>
                {errors.length === 0 ? (
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        ✓ Query is valid
                    </p>
                ) : (
                    <div className="flex flex-col gap-1">
                        {errors.slice(0, 3).map((err, i) => (
                            <p key={i} className="text-xs text-destructive">
                                ✕ {err.message}
                            </p>
                        ))}
                        {errors.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                                +{errors.length - 3} more errors
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}