"use client"
import { useQueryStore } from "@/store/query-store"
import {
    BookOpen,
    CheckCircle,
    ShieldCheck
} from "lucide-react"

const TYPE_COLORS: Record<string, string> = {
    string: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    number: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    enum: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    date: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    boolean: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
}

export function SchemaPanel() {
    const schema = useQueryStore((s) => s.schema)
    const errors = useQueryStore((s) => s.validationErrors)
    const hasExecuted = useQueryStore((s) => s.hasExecuted)

    return (
        <div className="border border-border/70 rounded-xl bg-card p-4 shadow-xs flex flex-col gap-4.5">
            {/* Schema fields listing */}
            <div>
                <div className="flex items-center gap-1.5 mb-2">
                    <BookOpen size={13} className="text-brand-accent" />
                    <h3 className="text-sm font-medium text-muted-foreground tracking-wider">
                        Schema fields
                    </h3>
                </div>
                <div className="border border-border/50 rounded-lg bg-muted/5 divide-y divide-border/30 max-h-48 overflow-y-auto custom-scrollbar">
                    {Object.values(schema).map((field) => (
                        <div
                            key={field.key}
                            className="flex items-center justify-between text-sm py-2 px-3 hover:bg-muted/15 transition-colors"
                        >
                            <span className="font-semibold text-foreground">{field.label}</span>
                            <span className={`px-2 py-0.5 rounded-md text-sm font-mono font-medium border ${TYPE_COLORS[field.type]}`}>
                                {field.type}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Validation Dashboard */}
            <div className="border-t border-border/60 pt-4">
                <div className="flex items-center gap-1.5 mb-2.5">
                    <ShieldCheck size={13} className="text-emerald-500" />
                    <h3 className="text-sm font-medium text-muted-foreground tracking-wider">
                        Validation
                    </h3>
                </div>

                {!hasExecuted ? (
                    <p className="text-sm text-muted-foreground/60 italic">
                        Run a query to see validation results.
                    </p>
                ) : errors.length === 0 ? (
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-start gap-2.5 animate-fade-in shadow-3xs">
                        <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
                        <div>
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                ✓ Query is valid
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 flex items-start gap-2.5 animate-fade-in shadow-3xs">
                        <div className="w-full">
                            <div className="flex flex-col gap-1 font-mono text-sm text-muted-foreground bg-black/5 dark:bg-black/30 p-2.5 rounded border border-border/30">
                                {errors.slice(0, 3).map((err, i) => (
                                    <p key={i} className="text-destructive font-medium leading-normal">
                                        ✕ {err.message}
                                    </p>
                                ))}
                                {errors.length > 3 && (
                                    <p className="text-muted-foreground font-medium pl-3 mt-0.5">
                                        +{errors.length - 3} more errors
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}