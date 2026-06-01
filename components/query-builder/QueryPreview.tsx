// Live query preview panel - updates in real time as user builds query
"use client"

import { useState } from "react"
import { useQueryStore } from "@/store/query-store"
import { generateMongo, generateFullSQL } from "@/lib/query-engine/generator"

export function QueryPreview() {
  const [mode, setMode] = useState<"sql" | "mongo">("sql")
  const root = useQueryStore((s) => s.root)
  const schema = useQueryStore((s) => s.schema)
  const selectedSchema = useQueryStore((s) => s.selectedSchema)

  const sql = generateFullSQL(root, schema, selectedSchema)
  const mongo = JSON.stringify(generateMongo(root), null, 2)

  return (
    <div className="border rounded-lg p-4 bg-background">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
        Live query preview
      </p>


      <div className="flex gap-2 mb-3">
        {(["sql", "mongo"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${mode === m
              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
              : "text-muted-foreground border-border hover:bg-muted"
              }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>


      <pre className="text-xs font-mono bg-muted rounded-md p-3 overflow-auto max-h-64 whitespace-pre-wrap break-words">
        {mode === "sql" ? sql : mongo}
      </pre>
    </div>
  )
}