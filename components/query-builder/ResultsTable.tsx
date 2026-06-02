"use client"
import { useEffect, useState } from "react"
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
    Loader2,
    ChevronLeft,
    ChevronRight,
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"

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
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium border ${styles} shadow-3xs`}>
            <span className={`h-1 w-1 rounded-full ${dot}`} />
            {status}
        </span>
    )
}

const PAGE_SIZE_OPTIONS = [1, 5, 10, 25]

export function ResultsTable() {
    const results = useQueryStore((s) => s.results)
    const schema = useQueryStore((s) => s.schema)
    const isExecuting = useQueryStore((s) => s.isExecuting)

    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const [sortCol, setSortCol] = useState<string | null>(null)
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

    useEffect(() => {
        setPage(0)
        setSortCol(null)
    }, [results])

    function handleSort(col: string) {
        if (sortCol !== col) {
            setSortCol(col)
            setSortDir("asc")
        } else if (sortDir === "asc") {
            setSortDir("desc")
        } else {
            setSortCol(null)
        }
        setPage(0)
    }

    const sortedResults = sortCol
        ? [...results].sort((a, b) => {
            const av = a[sortCol]
            const bv = b[sortCol]
            if (av === null || av === undefined) return 1
            if (bv === null || bv === undefined) return -1
            const cmp =
                typeof av === "number" && typeof bv === "number"
                    ? av - bv
                    : String(av).localeCompare(String(bv), undefined, { numeric: true })
            return sortDir === "asc" ? cmp : -cmp
        })
        : results

    const columns = Object.keys(schema)
    const totalPages = Math.ceil(sortedResults.length / pageSize)
    const pageRows = sortedResults.slice(page * pageSize, (page + 1) * pageSize)

    return (
        <div className="border border-border/70 rounded-xl bg-card shadow-xs overflow-hidden">

            <div className="px-4 py-3 border-b border-border/50 bg-muted/20 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                    <Table size={14} className="text-brand-accent animate-pulse" />
                    <h2 className="text-sm font-medium text-foreground tracking-wider">
                        Results
                    </h2>
                </div>

                {!isExecuting && results.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            {results.length} row{results.length !== 1 ? "s" : ""} matched
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">

                            <select
                                value={pageSize}
                                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0) }}
                                className="text-sm border border-border/80 rounded-md px-1.5 py-0.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-brand-primary"
                            >
                                {PAGE_SIZE_OPTIONS.map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                            <span>per page</span>
                        </div>
                    </div>
                )}

                {!isExecuting && results.length === 0 && (
                    <span className="text-sm font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-2.5 py-0.5 rounded-lg">
                        0 rows matched
                    </span>
                )}
            </div>


            {isExecuting ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="relative flex items-center justify-center">
                        <Loader2 size={24} className="animate-spin text-brand-primary" />
                        <span className="absolute inset-0 rounded-full bg-brand-primary/10 blur-md animate-ping" />
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground tracking-wide">
                        Executing query...
                    </p>
                </div>
            ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4 gap-2">
                    <div className="h-9 w-9 rounded-xl bg-muted/40 border border-dashed border-border/60 flex items-center justify-center text-muted-foreground/60">
                        <Table size={16} />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                        No results yet — execute a query to see matches
                    </p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-muted/10 sticky top-0 backdrop-blur-xs z-10">
                                    {columns.map((col) => {
                                        const isActive = sortCol === col
                                        return (
                                            <th
                                                key={col}
                                                onClick={() => handleSort(col)}
                                                className="py-2.5 px-3.5 text-sm font-medium text-muted-foreground tracking-wider cursor-pointer select-none hover:text-foreground transition-colors"
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    {getColumnIcon(col)}
                                                    {schema[col].label}
                                                    {isActive
                                                        ? sortDir === "asc"
                                                            ? <ArrowUp size={11} className="text-brand-primary shrink-0" />
                                                            : <ArrowDown size={11} className="text-brand-primary shrink-0" />
                                                        : <ArrowUpDown size={11} className="opacity-30 shrink-0" />
                                                    }
                                                </div>
                                            </th>
                                        )
                                    })}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {pageRows.map((row, i) => (
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

                    {totalPages > 1 && (
                        <div className="px-4 py-2.5 border-t border-border/50 bg-muted/10 flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-sm text-muted-foreground">
                                Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, results.length)} of {results.length}
                            </span>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 rounded-md border-border/80 bg-background"
                                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                >
                                    <ChevronLeft size={13} />
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <Button
                                        key={i}
                                        variant={page === i ? "default" : "outline"}
                                        size="sm"
                                        className={`h-7 min-w-[28px] px-2 text-sm rounded-md border-border/80 ${page === i ? "bg-foreground text-background" : "bg-background"}`}
                                        onClick={() => setPage(i)}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 rounded-md border-border/80 bg-background"
                                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                    disabled={page === totalPages - 1}
                                >
                                    <ChevronRight size={13} />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}