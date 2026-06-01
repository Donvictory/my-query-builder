"use client"
import { useQueryExecution } from "@/hooks/useQueryExecution"
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"
import { useQueryExport } from "@/hooks/useQueryExport"
import { useEffect, useCallback } from "react"
import { useQueryStore } from "@/store/query-store"
import { QueryGroup } from "@/components/query-builder/QueryGroup"
import { QueryPreview } from "@/components/query-builder/QueryPreview"
import { ResultsTable } from "@/components/query-builder/ResultsTable"
import { SchemaPanel } from "@/components/query-builder/SchemaPanel"
import { executeQuery } from "@/lib/query-engine/executor"
import { validateTree } from "@/lib/query-engine/validator"
import { MOCK_DATA } from "@/lib/schema/mock-data"
import { Button } from "@/components/ui/button"
import {
  Play,
  RotateCcw,
  Download,
  Upload,
  Moon,
  Sun,
  Bookmark,
  History,
} from "lucide-react"
import { useState } from "react"
import { QueryGroup as QueryGroupType } from "@/lib/schema/type"

export default function Home() {
  const root = useQueryStore((s) => s.root)
  const schema = useQueryStore((s) => s.schema)
  const selectedSchema = useQueryStore((s) => s.selectedSchema)
  const reset = useQueryStore((s) => s.reset)
  const presets = useQueryStore((s) => s.presets)
  const savePreset = useQueryStore((s) => s.savePreset)
  const loadPreset = useQueryStore((s) => s.loadPreset)
  const deletePreset = useQueryStore((s) => s.deletePreset)
  const undo = useQueryStore((s) => s.undo)
  const [showHistory, setShowHistory] = useState(false)
  const { execute } = useQueryExecution()
  const { exportQuery, importFromJSON } = useQueryExport()
  useKeyboardShortcut(execute)
  const [darkMode, setDarkMode] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  const [presetName, setPresetName] = useState("")
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState("")
  const [importError, setImportError] = useState("")
  const setResults = useQueryStore((s) => s.setResults)
  const history = useQueryStore((s) => s.history)
  const importQuery = useQueryStore((s) => s.importQuery)

  useEffect(() => {
    setResults([])
  }, [])


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])



  function handleImport() {
    const error = importFromJSON(importText)
    if (error) {
      setImportError(error)
      return
    }
    setShowImport(false)
    setImportText("")
    setImportError("")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      <header className="border-b px-4 py-3 flex items-center justify-between sticky top-0 bg-background z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold">QueryCraft</h1>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {selectedSchema}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={exportQuery}>
            <Download size={13} />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setShowImport(!showImport)}>
            <Upload size={13} />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setShowPresets(!showPresets)}>
            <Bookmark size={13} />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={undo}>
            <History size={13} />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={13} /> : <Moon size={13} />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History size={13} />
          </Button>
        </div>
      </header>

      {/* Import panel */}
      {showImport && (
        <div className="border-b px-6 py-4 bg-muted/30">
          <p className="text-xs font-medium mb-2">Paste query JSON</p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="w-full h-32 text-xs font-mono border rounded-md p-2 bg-background resize-none"
            placeholder='{ "type": "group", "logic": "AND", "children": [...] }'
          />
          {importError && <p className="text-xs text-destructive mt-1">{importError}</p>}
          <div className="flex gap-2 mt-2">
            <Button size="sm" className="h-7 text-xs" onClick={handleImport}>Import</Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setShowImport(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Presets panel */}
      {showPresets && (
        <div className="border-b px-6 py-4 bg-muted/30">
          <p className="text-xs font-medium mb-3">Saved presets</p>
          <div className="flex gap-2 mb-3">
            <input
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Preset name..."
              className="text-xs border rounded-md px-2 py-1 bg-background h-7"
            />
            <Button
              size="sm"
              className="h-7 text-xs"
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
          {presets.length === 0 ? (
            <p className="text-xs text-muted-foreground">No presets saved yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {presets.map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-xs">
                  <span className="text-foreground">{p.name}</span>
                  <span className="text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs px-2"
                    onClick={() => loadPreset(p.id)}
                  >
                    Load
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs px-2 text-destructive"
                    onClick={() => deletePreset(p.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History panel */}
      {showHistory && (
        <div className="border-b px-6 py-4 bg-muted/30">
          <p className="text-xs font-medium mb-3">Query history</p>
          {history.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No history yet — execute a query to start tracking
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {[...history].reverse().map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs border rounded-md px-3 py-2 bg-background"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-foreground font-medium">
                      Query {history.length - i}
                    </span>
                    <span className="text-muted-foreground">
                      {h.children.length} condition{h.children.length !== 1 ? "s" : ""} — {h.logic}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs px-2"
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
      )}


      <main className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 p-3 sm:p-6 max-w-7xl mx-auto w-full">

        <div className="flex flex-col gap-4">

          <div className="border rounded-lg p-3 sm:p-4 bg-background">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Query builder
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={reset}
                >
                  <RotateCcw size={12} className="mr-1" /> Reset
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={execute}
                >
                  <Play size={12} /> Execute
                  <span className="text-xs opacity-60 ml-1 hidden sm:inline">Ctrl+↵</span>
                </Button>
              </div>
            </div>

            <QueryGroup node={root} depth={0} isRoot={true} />
          </div>


          <ResultsTable />
        </div>

        <div className="flex flex-col gap-4 lg:order-last">
          <QueryPreview />
          <SchemaPanel />
        </div>
      </main>
    </div>
  )
}