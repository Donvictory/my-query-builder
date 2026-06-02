"use client"
import { History, X } from 'lucide-react'
import { Button } from '../ui/button'
import { QueryGroup } from '@/lib/schema/type'
import { useQueryStore } from '@/store/query-store'



export default function HistoryModal({ setShowHistory, history }: { setShowHistory: (showHistory: boolean) => void, history: QueryGroup[] }) {
    const importQuery = useQueryStore((s) => s.importQuery)
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-md glass-panel rounded-xl overflow-hidden shadow-2xl border bg-card text-card-foreground animate-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b flex items-center justify-between bg-muted/20">
                    <h2 className="text-sm font-semibold flex items-center gap-1.5">
                        <History size={14} className="text-brand-primary" />
                        Query history
                    </h2>
                    <button onClick={() => setShowHistory(false)} className="h-5 w-5 rounded-md flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        <X size={13} />
                    </button>
                </div>
                <div className="p-4">
                    <div className="border border-border/60 rounded-lg overflow-hidden bg-muted/5 max-h-56 overflow-y-auto custom-scrollbar">
                        {history.length === 0 ? (
                            <div className="py-10 text-center text-sm text-muted-foreground">
                                No history yet — execute a query to start tracking
                            </div>
                        ) : (
                            <div className="divide-y divide-border/40">
                                {[...history].reverse().map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between px-3.5 py-2.5 hover:bg-muted/30 transition-colors"
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-semibold text-foreground">
                                                Query {history.length - i}
                                            </span>
                                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                <span className={`h-1.5 w-1.5 rounded-full ${h.logic === "AND" ? "bg-blue-400" : "bg-amber-400"}`} />
                                                {h.children.length} condition{h.children.length !== 1 ? "s" : ""} — {h.logic}
                                            </span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-6.5 text-sm font-semibold"
                                            onClick={() => {
                                                importQuery(JSON.parse(JSON.stringify(h)))
                                                setShowHistory(false)
                                            }}
                                        >
                                            Restore
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="px-4 py-2 border-t bg-muted/5 flex items-center justify-end">
                    <Button size="sm" variant="ghost" className="h-8 text-sm font-medium" onClick={() => setShowHistory(false)}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    )
}