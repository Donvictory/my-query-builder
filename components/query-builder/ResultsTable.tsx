"use client"
import { useQueryStore } from "@/store/query-store"
import {
    User,
    Mail,
    Globe,
    Calendar,
    Hash,
    Boxes,
    Star,
    Tag,
    Key,
    Activity,
    Database,
    Table,
    Loader2
} from "lucide-react"

// Dynamic Column Helper to assign distinct technical icons
function getColumnIcon(col: string) {
    const norm = col.toLowerCase()
    if (norm.includes("name")) return <User size={11} className="text-brand-primary" />
    if (norm.includes("email")) return <Mail size={11} className="text-brand-accent" />
    if (norm.includes("country")) return <Globe size={11} className="text-emerald-500" />
    if (norm.includes("date") || norm.includes("created")) return <Calendar size={11} className="text-amber-500" />
    if (norm.includes("id")) return <Key size={11} className="text-purple-500" />
    if (norm.includes("status")) return <Activity size={11} className="text-rose-500" />
    if (norm.includes("category")) return <Tag size={11} className="text-blue-400" />
    if (norm.includes("stock") || norm.includes("count")) return <Boxes size={11} className="text-orange-400" />
    if (norm.includes("rating")) return <Star size={11} className="text-yellow-500" />
    if (["age", "purchases", "price", "amount"].includes(col)) return <Hash size={11} className="text-indigo-400" />
    return <Database size={11} className="text-muted-foreground" />
}

// Visual status pill generator
function renderStatusPill(status: string) {
    const val = status.toLowerCase()
    let styles = "bg-muted/40 text-muted-foreground border-border"
    let dot = "bg-muted-foreground"

    if (["active", "delivered", "true"].includes(val)) {
        styles = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        dot = "bg-emerald-500"
    } else if (["pending", "processing"].includes(val)) {
        styles = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        dot = "bg-amber-500"
    } else if (["shipped"].includes(val)) {
        styles = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        dot = "bg-blue-500"
    } else if (["inactive", "cancelled", "false"].includes(val)) {
        styles = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
        dot = "bg-rose-500"
    }

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${styles} shadow-3xs`}>
            <span className={`h-1 w-1 rounded-full ${dot}`} />
            {status}
        </span>
    )
}

export function ResultsTable() {
    const results = useQueryStore((s) => s.results)
    const schema = useQueryStore((s) => s.schema)
    const isExecuting = useQueryStore((s) => s.isExecuting)

    const columns = Object.keys(schema)

    return (
        <div className="border border-border/70 rounded-xl bg-card shadow-xs overflow-hidden">
            {/* Panel Header */}
            <div className="px-4 py-3 border-b border-border/50 bg-muted/20 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                    <Table size={14} className="text-brand-accent animate-pulse" />
                    <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Results
                    </h2>
                </div>
                
                {!isExecuting && (
                    <span className="text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        {results.length} row{results.length !== 1 ? "s" : ""} matched
                    </span>
                )}
            </div>

            {/* Content Area */}
            {isExecuting ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="relative flex items-center justify-center">
                        <Loader2 size={24} className="animate-spin text-brand-primary" />
                        <span className="absolute inset-0 rounded-full bg-brand-primary/10 blur-md animate-ping" />
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground tracking-wide">
                        Executing query...
                    </p>
                </div>
            ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4 gap-2">
                    <div className="h-9 w-9 rounded-xl bg-muted/40 border border-dashed border-border/60 flex items-center justify-center text-muted-foreground/60">
                        <Table size={16} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-foreground">
                            No results yet — execute a query to see matches
                        </p>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto max-h-80 custom-scrollbar">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-muted/10 sticky top-0 backdrop-blur-xs z-10">
                                {columns.map((col) => (
                                    <th
                                        key={col}
                                        className="py-2.5 px-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            {getColumnIcon(col)}
                                            {schema[col].label}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {results.map((row, i) => (
                                <tr
                                    key={i}
                                    className="hover:bg-muted/15 dark:hover:bg-muted/5 transition-colors"
                                >
                                    {columns.map((col) => {
                                        const cellValue = row[col]
                                        return (
                                            <td key={col} className="py-2 px-3.5 text-foreground font-medium whitespace-nowrap">
                                                {col === "status" || typeof cellValue === "boolean" ? (
                                                    renderStatusPill(String(cellValue))
                                                ) : (
                                                    String(cellValue ?? "—")
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}