"use client"
import { useQueryExecution } from "@/hooks/useQueryExecution"
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useQueryStore } from "@/store/query-store"
import { QueryGroup } from "@/components/query-builder/QueryGroup"
import { QueryPreview } from "@/components/query-builder/QueryPreview"
import { ResultsTable } from "@/components/query-builder/ResultsTable"
import { SchemaPanel } from "@/components/query-builder/SchemaPanel"
import { Button } from "@/components/ui/button"
import {
  Play,
  RotateCcw,
} from "lucide-react"
import { QuerybuilderNav } from "@/components/query-builder/QueryBuilderNav"
import HistoryModal from "@/components/query-builder/HistoryModal"
import ImportModal from "@/components/query-builder/ImportModal"
import PresetModal from "@/components/query-builder/PresetModal"

export default function Home() {
  const root = useQueryStore((s) => s.root)
  const reset = useQueryStore((s) => s.reset)
  const [showHistory, setShowHistory] = useState(false)
  const { execute } = useQueryExecution()
  useKeyboardShortcut(execute)
  const [showPresets, setShowPresets] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const setResults = useQueryStore((s) => s.setResults)
  const history = useQueryStore((s) => s.history)



  useEffect(() => {
    setResults([])
  }, [setResults])

  return (
    <div className="font-uniform min-h-screen bg-background text-foreground transition-colors duration-300">
      <QuerybuilderNav setShowHistory={setShowHistory} setShowImport={setShowImport} setShowPresets={setShowPresets} />
      {showImport && (
        <ImportModal setShowImport={setShowImport} />
      )}

      {showPresets && (
        <PresetModal setShowPresets={setShowPresets} />
      )}

      {showHistory && (
        <HistoryModal setShowHistory={setShowHistory} history={history} />
      )}

      <main className="max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

        <div className="flex flex-col gap-5 min-w-0">

          <motion.div
            className="border border-border/70 rounded-xl bg-card shadow-xs overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          >

            <div className="px-4 py-3 bg-muted/20 border-b border-border/50 flex items-center justify-between flex-wrap gap-2.5">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-medium text-foreground tracking-wider">
                  Build your query
                </h2>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-card/40">
              <QueryGroup node={root} depth={0} isRoot={true} />
              <div className="flex items-center gap-1.5 justify-end">
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22, ease: "easeOut" }}
          >
            <ResultsTable />
          </motion.div>
        </div>

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