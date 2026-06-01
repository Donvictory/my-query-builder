import { useCallback } from "react"
import { useQueryStore } from "@/store/query-store"
import { QueryGroup } from "@/lib/schema/type"

export function useQueryExport() {
    const root = useQueryStore((s) => s.root)
    const importQuery = useQueryStore((s) => s.importQuery)

    const exportQuery = useCallback(() => {
        const json = JSON.stringify(root, null, 2)
        const blob = new Blob([json], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "query.json"
        a.click()
        URL.revokeObjectURL(url)
    }, [root])

    const importFromJSON = useCallback((text: string): string | null => {
        try {
            const parsed = JSON.parse(text)
            if (parsed.type !== "group" || !parsed.children || !parsed.logic) {
                return "Invalid query structure"
            }
            importQuery(parsed as QueryGroup)
            return null
        } catch {
            return "Invalid JSON — please check your input"
        }
    }, [])

    return { exportQuery, importFromJSON }
}