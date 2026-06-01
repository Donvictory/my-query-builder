"use client"
import { useState } from "react"
import { useQueryStore } from "@/store/query-store"
import { generateMongo, generateFullSQL } from "@/lib/query-engine/generator"
import { Copy, Check, Terminal } from "lucide-react"



function highlightMongo(mongo: string): string {
  let esc = mongo
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")


  esc = esc.replace(/("\$[a-zA-Z]+"):/g, '<span class="token-keyword">$1</span>:')

  esc = esc.replace(/("[\w_]+"):(\s*)/g, '<span class="token-property">$1</span>:$2')

  esc = esc.replace(/:(\s*)("[^"]*")/g, ':$1<span class="token-string">$2</span>')
  return esc
}

export function QueryPreview() {
  const [mode, setMode] = useState<"sql" | "mongo">("sql")
  const [copied, setCopied] = useState(false)
  const root = useQueryStore((s) => s.root)
  const schema = useQueryStore((s) => s.schema)
  const selectedSchema = useQueryStore((s) => s.selectedSchema)

  const sql = generateFullSQL(root, schema, selectedSchema)
  const mongo = JSON.stringify(generateMongo(root), null, 2)

  const highlightedCode = mode === "mongo" ? highlightMongo(mongo) : null

  function handleCopy() {
    navigator.clipboard.writeText(mode === "sql" ? sql : mongo)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-border/70 rounded-xl bg-card overflow-hidden shadow-xs">
      {/* Header */}
      <div className="px-4 py-2.5 bg-muted/20 border-b border-border/50 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Terminal size={14} className="text-brand-primary" />
          <h3 className="text-sm font-medium text-muted-foreground tracking-wider">
            Live query preview
          </h3>
        </div>

        {/* SQL / Mongo Switcher Tabs */}
        <div className="flex border border-border/80 rounded-lg p-0.5 bg-background shadow-3xs">
          {(["sql", "mongo"] as const).map((m) => {
            const active = mode === m
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`text-sm font-medium px-3 py-1 rounded-md transition-all cursor-pointer ${active
                  ? "bg-brand-primary/10 text-brand-primary shadow-3xs"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {m.toUpperCase()}
              </button>
            )
          })}
        </div>
      </div>

      {/* IDE Syntax Editor Console Container */}
      <div className="relative bg-slate-950 dark:bg-slate-950 p-4 font-mono text-sm select-text">

        {/* Visual Window Controls */}
        <div className="flex gap-1.5 mb-3.5 select-none">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>

        {/* Floating Action Button for Copying */}
        <button
          onClick={handleCopy}
          className={`absolute right-3.5 top-3.5 h-[30px] min-w-[30px] px-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm ${copied
            ? "bg-emerald-500 border-emerald-400 text-white"
            : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
            }`}
        >
          {copied ? <><Check size={11} /> Copied!</> : <Copy size={11} />}
        </button>

        {/* Scrollable syntax editor */}
        <pre className="text-slate-100 font-mono text-sm leading-relaxed overflow-x-auto max-h-64 whitespace-pre-wrap break-all custom-scrollbar pb-1 pr-16 select-text selection:bg-cyan-500/30">
          {mode === "sql" ? (
            <code className="font-mono select-text">{sql}</code>
          ) : (
            <code
              dangerouslySetInnerHTML={{ __html: highlightedCode! }}
              className="font-mono select-text"
            />
          )}
        </pre>
      </div>
    </div>
  )
}