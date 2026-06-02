import { FileJson, X } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { Button } from '../ui/button';
import { useQueryExport } from '@/hooks/useQueryExport';
import toast from 'react-hot-toast';

export default function ImportModal({ setShowImport }: { setShowImport: (showImport: boolean) => void }) {
    const [importText, setImportText] = useState("")
    const [importError, setImportError] = useState("")
    const [isDragOver, setIsDragOver] = useState(false)
    const { importFromJSON } = useQueryExport()

    function handleImport() {
        const error = importFromJSON(importText)
        if (error) {
            setImportError(error)
            return
        }
        toast.success("Query imported successfully")
        setShowImport(false)
        setImportText("")
        setImportError("")
    }

    function handleFileDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setIsDragOver(false)
        const file = e.dataTransfer.files[0]
        if (!file) return
        if (!file.name.endsWith(".json")) {
            setImportError("Only .json files are supported")

            return
        }
        const reader = new FileReader()
        reader.onload = (ev) => {
            const text = ev.target?.result as string
            setImportText(text)
            const error = importFromJSON(text)
            if (error) {
                setImportError(error)

            } else {
                setShowImport(false)
                setImportText("")
                setImportError("")
            }
        }
        reader.readAsText(file)
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-md glass-panel rounded-xl overflow-hidden shadow-2xl border bg-card text-card-foreground animate-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b flex items-center justify-between bg-muted/20">
                    <h2 className="text-sm font-semibold flex items-center gap-1.5">
                        <FileJson size={14} className="text-brand-primary" />
                        Import JSON
                    </h2>
                    <button onClick={() => setShowImport(false)} className="h-5 w-5 rounded-md flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        <X size={13} />
                    </button>
                </div>
                <div className="p-4">
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleFileDrop}
                        className={`relative rounded-lg transition-all duration-150 ${isDragOver ? "ring-2 ring-brand-primary ring-offset-1" : ""}`}
                    >
                        <textarea
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                            className={`w-full h-40 text-sm font-mono border rounded-lg p-2.5 bg-background resize-none focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary custom-scrollbar transition-colors ${isDragOver ? "border-brand-primary opacity-40 pointer-events-none" : "border-border/80"}`}
                            placeholder='{ "schema": "users", "root": { "type": "group", "logic": "AND", "id": "root", "children": [...] } }'
                        />
                        {isDragOver && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-brand-primary/5 pointer-events-none">
                                <FileJson size={28} className="text-brand-primary" />
                                <p className="text-sm font-semibold text-brand-primary">Drop your JSON file here</p>
                            </div>
                        )}
                    </div>
                    {!isDragOver && (
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                            Paste JSON above or <span className="text-brand-primary font-medium">drag & drop a .json file</span>
                        </p>
                    )}
                    {importError && (
                        <div className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-2.5 py-1.5 mt-2 font-medium">
                            {importError}
                        </div>
                    )}
                </div>
                <div className="px-4 py-3 border-t bg-muted/10 flex items-center justify-end gap-2">
                    <Button size="sm" variant="ghost" className="h-8 text-sm font-medium" onClick={() => setShowImport(false)}>
                        Cancel
                    </Button>
                    <Button size="sm" className="h-8 text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 shadow-sm" onClick={handleImport}>
                        Import
                    </Button>
                </div>
            </div>
        </div>
    )
}




