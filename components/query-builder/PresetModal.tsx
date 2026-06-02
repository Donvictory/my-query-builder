import { STARTER_PRESETS } from '@/lib/schema/starter-presets'
import { Bookmark, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { useQueryStore } from '@/store/query-store'


export default function PresetModal({ setShowPresets }: { setShowPresets: (showPresets: boolean) => void }) {
    const presets = useQueryStore((s) => s.presets)
    const savePreset = useQueryStore((s) => s.savePreset)
    const loadPreset = useQueryStore((s) => s.loadPreset)
    const deletePreset = useQueryStore((s) => s.deletePreset)
    const loadStarterPreset = useQueryStore((s) => s.loadStarterPreset)
    const [presetName, setPresetName] = useState("")
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-lg glass-panel rounded-xl overflow-hidden shadow-2xl border bg-card text-card-foreground animate-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b flex items-center justify-between bg-muted/20">
                    <h2 className="text-sm font-semibold flex items-center gap-1.5">
                        <Bookmark size={14} className="text-brand-primary" />
                        Presets
                    </h2>
                    <button onClick={() => setShowPresets(false)} className="h-5 w-5 rounded-md flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        <X size={13} />
                    </button>
                </div>
                <div className="p-4 flex flex-col gap-4">

                    <div>
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Try loading these examples
                        </p>
                        <div className="border border-border/60 rounded-lg overflow-hidden bg-muted/5 max-h-48 overflow-y-auto custom-scrollbar">
                            <div className="divide-y divide-border/40">
                                {STARTER_PRESETS.map((p) => (
                                    <div key={p.id} className="flex items-center justify-between px-3 py-2.5 hover:bg-muted/30 transition-colors">
                                        <div className="flex flex-col gap-0.5 max-w-[70%]">
                                            <span className="text-sm font-semibold text-foreground">{p.name}</span>
                                            <span className="text-sm text-muted-foreground">{p.description}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-6 text-sm px-2.5 font-semibold text-brand-primary border-brand-primary/20 hover:bg-brand-primary/5 hover:text-brand-primary shrink-0"
                                            onClick={() => {
                                                loadStarterPreset(p)
                                                setShowPresets(false)
                                            }}
                                        >
                                            Try
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Your saved presets
                        </p>
                        <div className="flex gap-2 mb-2">
                            <input
                                value={presetName}
                                onChange={(e) => setPresetName(e.target.value)}
                                placeholder="Name this query..."
                                className="flex-1 text-sm border border-border/80 rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary h-8"
                            />
                            <Button
                                size="sm"
                                className="h-8 text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 shadow-sm gap-1 shrink-0"
                                onClick={() => {
                                    if (presetName.trim()) {
                                        savePreset(presetName.trim())
                                        setPresetName("")
                                    }
                                }}
                            >
                                Save current query
                            </Button>
                        </div>
                        <div className="border border-border/60 rounded-lg overflow-hidden bg-muted/5 max-h-40 overflow-y-auto custom-scrollbar">
                            {presets.length === 0 ? (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    No presets saved yet
                                </div>
                            ) : (
                                <div className="divide-y divide-border/40">
                                    {presets.map((p) => (
                                        <div key={p.id} className="flex items-center justify-between px-3 py-2 hover:bg-muted/30 transition-colors">
                                            <div className="flex flex-col gap-0.5 max-w-[65%]">
                                                <span className="text-sm font-semibold truncate text-foreground">{p.name}</span>
                                                <span className="text-sm text-muted-foreground font-mono">
                                                    {new Date(p.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-6 text-sm px-2.5 font-semibold text-brand-primary border-brand-primary/20 hover:bg-brand-primary/5 hover:text-brand-primary"
                                                    onClick={() => {
                                                        loadPreset(p.id)
                                                        setShowPresets(false)
                                                    }}
                                                >
                                                    Load
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 text-sm px-2 text-destructive hover:bg-destructive/5"
                                                    onClick={() => deletePreset(p.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="px-4 py-2 border-t bg-muted/5 flex items-center justify-end">
                    <Button size="sm" variant="ghost" className="h-8 text-sm font-medium" onClick={() => setShowPresets(false)}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    )
}
