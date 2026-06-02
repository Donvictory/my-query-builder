"use client"
import { useQueryExecution } from "@/hooks/useQueryExecution"
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"
import { useQueryExport } from "@/hooks/useQueryExport"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useQueryStore } from "@/store/query-store"
import { QueryGroup } from "@/components/query-builder/QueryGroup"
import { QueryPreview } from "@/components/query-builder/QueryPreview"
import { ResultsTable } from "@/components/query-builder/ResultsTable"
import { SCHEMA_NAMES } from "@/lib/schema/schemas"
import { SchemaPanel } from "@/components/query-builder/SchemaPanel"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Play,
  RotateCcw,
  Download,
  Upload,
  Moon,
  Sun,
  Bookmark,
  History,
  Undo,
  Redo,
  Database,
  X,
  FileJson,
  Menu,
  ChevronLeft,
  ChevronDown,
} from "lucide-react"
import { STARTER_PRESETS } from "@/lib/schema/starter-presets"

export default function Home() {
  const root = useQueryStore((s) => s.root)
  const selectedSchema = useQueryStore((s) => s.selectedSchema)
  const setSchema = useQueryStore((s) => s.setSchema)
  const reset = useQueryStore((s) => s.reset)
  const presets = useQueryStore((s) => s.presets)
  const savePreset = useQueryStore((s) => s.savePreset)
  const loadPreset = useQueryStore((s) => s.loadPreset)
  const deletePreset = useQueryStore((s) => s.deletePreset)
  const loadStarterPreset = useQueryStore((s) => s.loadStarterPreset)
  const undo = useQueryStore((s) => s.undo)
  const redo = useQueryStore((s) => s.redo)
  const [showHistory, setShowHistory] = useState(false)
  const { execute } = useQueryExecution()
  const { exportQuery, importFromJSON } = useQueryExport()
  useKeyboardShortcut(execute)
  const darkMode = useQueryStore((s) => s.darkMode)
  const toggleDarkMode = useQueryStore((s) => s.toggleDarkMode)
  const [showPresets, setShowPresets] = useState(false)
  const [presetName, setPresetName] = useState("")
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState("")
  const [importError, setImportError] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const importErrorTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const setResults = useQueryStore((s) => s.setResults)
  const history = useQueryStore((s) => s.history)
  const importQuery = useQueryStore((s) => s.importQuery)

  useEffect(() => {
    setResults([])
  }, [setResults])

  function handleImport() {
    const error = importFromJSON(importText)
    if (error) {
      setImportError(error)
      if (importErrorTimer.current) clearTimeout(importErrorTimer.current)
      importErrorTimer.current = setTimeout(() => setImportError(""), 3000)
      return
    }
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
      if (importErrorTimer.current) clearTimeout(importErrorTimer.current)
      importErrorTimer.current = setTimeout(() => setImportError(""), 3000)
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setImportText(text)
      const error = importFromJSON(text)
      if (error) {
        setImportError(error)
        if (importErrorTimer.current) clearTimeout(importErrorTimer.current)
        importErrorTimer.current = setTimeout(() => setImportError(""), 3000)
      } else {
        setShowImport(false)
        setImportText("")
        setImportError("")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="font-uniform min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* Premium Glassmorphic Header */}
      <motion.header
        className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border/60 px-4 py-2.5"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between w-full">
          {/* Logo & Schema */}
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-bold tracking-tight">
              <a href="/">QueryCraft</a>
            </h1>
            <div className="relative flex items-center ml-1.5">
              <Database size={10} className="absolute left-2 text-brand-primary dark:text-brand-accent pointer-events-none z-10" />
              <select
                value={selectedSchema}
                onChange={(e) => setSchema(e.target.value)}
                className="appearance-none text-sm font-medium text-brand-primary dark:text-brand-accent bg-brand-primary/10 dark:bg-brand-primary/20 border border-brand-primary/20 rounded-lg pl-5 pr-6 py-0.5 focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer"
              >
                {SCHEMA_NAMES.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <ChevronDown size={10} className="absolute right-2 text-brand-primary dark:text-brand-accent pointer-events-none" />
            </div>
          </div>

          {/* Desktop Toolbar Buttons (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-1.5">
            <div className="flex items-center border-r border-border/80 pr-1.5 mr-1.5 gap-1">
              <Button variant="ghost" size="icon" className="h-[34px] w-[34px] rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center" onClick={undo} title="Undo">
                <Undo size={13} />
              </Button>
              <Button variant="ghost" size="icon" className="h-[34px] w-[34px] rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center" onClick={redo} title="Redo">
                <Redo size={13} />
              </Button>
            </div>

            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-[34px] px-4 text-sm font-medium gap-2 bg-background border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all" onClick={() => setShowPresets(true)} title="Save and load query presets">
                <Bookmark size={12} className="text-brand-primary" />
                <span>Presets</span>
              </Button>
              <Button variant="outline" size="sm" className="h-[34px] px-4 text-sm font-medium gap-2 bg-background border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all" onClick={() => setShowImport(true)} title="Import a query from JSON">
                <Upload size={12} />
                <span>Import</span>
              </Button>
              <Button variant="outline" size="sm" className="h-[34px] px-4 text-sm font-medium gap-2 bg-background border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all" onClick={exportQuery} title="Export current query as JSON">
                <Download size={12} />
                <span>Export</span>
              </Button>
              <Button variant="outline" size="sm" className="h-[34px] px-4 text-sm font-medium gap-2 bg-background border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all" onClick={() => setShowHistory(true)} title="View past query executions">
                <History size={12} />
                <span>History</span>
              </Button>
            </div>

            <div className="border-l border-border/80 pl-1.5 ml-1.5 flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-[34px] w-[34px] rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center" onClick={toggleDarkMode} title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
                {darkMode ? <Sun size={13} className="text-amber-500" /> : <Moon size={13} />}
              </Button>
              <Link href="/" className="inline-flex items-center gap-1.5 h-[34px] px-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Back to landing page">
                <ChevronLeft size={13} /> Home
              </Link>
            </div>
          </div>

          {/* Mobile Navigation Trigger (Hidden on Desktop) */}
          <div className="flex md:hidden items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-[34px] w-[34px] rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center"
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun size={13} className="text-amber-500" /> : <Moon size={13} />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-[34px] w-[34px] rounded-md bg-background border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={14} />
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Panel Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2.5 p-3 rounded-xl border border-border/70 bg-card/95 backdrop-blur-md shadow-lg flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-1.5 border-b border-border/40 pb-2 mb-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-sm justify-start gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  undo()
                  setMobileMenuOpen(false)
                }}
              >
                <Undo size={13} /> Undo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-sm justify-start gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  redo()
                  setMobileMenuOpen(false)
                }}
              >
                <Redo size={13} /> Redo
              </Button>
            </div>

            <div className="flex flex-col gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-sm justify-start gap-2 bg-background border-border/80 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setShowPresets(true)
                  setMobileMenuOpen(false)
                }}
              >
                <Bookmark size={12} className="text-brand-primary" /> Presets
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-sm justify-start gap-2 bg-background border-border/80 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setShowImport(true)
                  setMobileMenuOpen(false)
                }}
              >
                <Upload size={12} /> Import JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-sm justify-start gap-2 bg-background border-border/80 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  exportQuery()
                  setMobileMenuOpen(false)
                }}
              >
                <Download size={12} /> Export JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-sm justify-start gap-2 bg-background border-border/80 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setShowHistory(true)
                  setMobileMenuOpen(false)
                }}
              >
                <History size={12} /> Execution History
              </Button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border border-border/80 bg-background text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ChevronLeft size={12} /> Home
              </Link>
            </div>
          </div>
        )}
      </motion.header>



      {showImport && (
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
      )}

      {/* Presets Modal */}
      {showPresets && (
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

              {/* Examples Section */}
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

              {/* Save Section */}
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
      )}

      {/* History Modal */}
      {showHistory && (
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
      )}

      {/* --- CORE WORKSPACE WORKBENCH --- */}
      <main className="max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

        {/* Left Side: Query Builder and Results */}
        <div className="flex flex-col gap-5 min-w-0">

          {/* Query Builder Box */}
          <motion.div
            className="border border-border/70 rounded-xl bg-card shadow-xs overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          >

            {/* Box Header */}
            <div className="px-4 py-3 bg-muted/20 border-b border-border/50 flex items-center justify-between flex-wrap gap-2.5">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-medium text-foreground uppercase tracking-wider">
                  Query builder
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-[34px] px-3.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={reset}
                >
                  <RotateCcw size={11} className="mr-1" /> Reset
                </Button>
                <Button
                  size="sm"
                  className="h-[34px] text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 shadow-xs px-5 gap-2 glowing-active"
                  onClick={execute}
                  title="Execute (Ctrl + Enter)"
                >
                  <Play size={11} fill="currentColor" /> Execute
                </Button>
              </div>
            </div>

            {/* Tree Workspace */}
            <div className="p-4 sm:p-5 bg-card/40">
              <QueryGroup node={root} depth={0} isRoot={true} />
            </div>
          </motion.div>

          {/* Results Table Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22, ease: "easeOut" }}
          >
            <ResultsTable />
          </motion.div>
        </div>

        {/* Right Side Sidebar: Live Preview & Schema Definition */}
        <motion.div
          className="flex flex-col gap-5 lg:sticky lg:top-[65px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16, ease: "easeOut" }}
        >
          <QueryPreview />
          <SchemaPanel />
        </motion.div>
      </main>
    </div>
  )
}