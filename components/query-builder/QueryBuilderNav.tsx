import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"
import { useQueryExecution } from "@/hooks/useQueryExecution"
import { useQueryExport } from "@/hooks/useQueryExport"
import { useQueryStore } from "@/store/query-store"
import { motion } from "framer-motion"
import { Bookmark, ChevronDown, ChevronLeft, Database, Download, History, Menu, Moon, Redo, Sun, Undo, Upload } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "../ui/button"
import { SCHEMA_NAMES } from "@/lib/schema/schemas"

export function QuerybuilderNav({ setShowHistory, setShowImport, setShowPresets }: { setShowHistory: (show: boolean) => void, setShowImport: (show: boolean) => void, setShowPresets: (show: boolean) => void }) {

    const selectedSchema = useQueryStore((s) => s.selectedSchema)
    const setSchema = useQueryStore((s) => s.setSchema)
    const undo = useQueryStore((s) => s.undo)
    const redo = useQueryStore((s) => s.redo)
    const { execute } = useQueryExecution()
    const { exportQuery, importFromJSON } = useQueryExport()
    useKeyboardShortcut(execute)
    const darkMode = useQueryStore((s) => s.darkMode)
    const toggleDarkMode = useQueryStore((s) => s.toggleDarkMode)

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <motion.header
            className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border/60 px-4 py-2.5"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className="flex items-center justify-between w-full">

                <div className="flex items-center gap-2.5">
                    <h1 className="text-lg font-bold tracking-tight">

                        <Link href="/">QueryCraft</Link>
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
    )
}