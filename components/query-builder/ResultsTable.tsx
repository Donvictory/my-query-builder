"use client"

import { useQueryStore } from "@/store/query-store"

export function ResultsTable() {
    const schema = useQueryStore((s) => s.schema)
    const results = useQueryStore((s) => s.results)
    const isExecuting = useQueryStore((s) => s.isExecuting)
    const columns = Object.keys(schema)

    if (isExecuting) {
        return (
            <div className="border rounded-lg p-4 bg-background">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Results
                </p>
                <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground animate-pulse">
                        Executing query...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="border rounded-lg p-4 bg-background">
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Results
                </p>
                <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                    {results.length} row{results.length !== 1 ? "s" : ""} matched
                </span>
            </div>

            {results.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">
                        No results yet — execute a query to see matches
                    </p>
                </div>
            ) : (
                <div className="overflow-auto max-h-72">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b">
                                {columns.map((col) => (
                                    <th
                                        key={col}
                                        className="text-left py-2 px-3 text-muted-foreground font-medium"
                                    >
                                        {schema[col].label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((row, i) => (
                                <tr
                                    key={i}
                                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                                >
                                    {columns.map((col) => (
                                        <td key={col} className="py-2 px-3 text-foreground">
                                            {col === "status" ? (
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${row[col] === "active"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                                                        : row[col] === "inactive"
                                                            ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                                        }`}
                                                >
                                                    {String(row[col])}
                                                </span>
                                            ) : typeof row[col] === "boolean" ? (
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs ${row[col]
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {String(row[col])}
                                                </span>
                                            ) : (
                                                String(row[col] ?? "—")
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}