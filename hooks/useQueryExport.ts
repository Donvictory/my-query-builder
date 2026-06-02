import { useCallback } from "react"
import { useQueryStore } from "@/store/query-store"
import { QueryGroup, QueryNode } from "@/lib/schema/type"
import { StarterPreset } from "@/lib/schema/starter-presets"

function validateNode(node: QueryNode): boolean {
    if (node.type === "rule") {
        return (
            typeof node.field === "string" && node.field.length > 0 &&
            typeof node.operator === "string" && node.operator.length > 0 &&
            node.value !== undefined
        )
    }
    if (node.type === "group") {
        return (
            (node.logic === "AND" || node.logic === "OR") &&
            Array.isArray(node.children) &&
            node.children.every(validateNode)
        )
    }
    return false
}

export function useQueryExport() {
    const root = useQueryStore((s) => s.root)
    const selectedSchema = useQueryStore((s) => s.selectedSchema)
    const importQuery = useQueryStore((s) => s.importQuery)
    const loadStarterPreset = useQueryStore((s) => s.loadStarterPreset)

    const exportQuery = useCallback(() => {
        const json = JSON.stringify({ schema: selectedSchema, root }, null, 2)
        const blob = new Blob([json], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "query.json"
        a.click()
        URL.revokeObjectURL(url)
    }, [root, selectedSchema])

    const importFromJSON = useCallback((text: string): string | null => {
        try {
            const parsed = JSON.parse(text)

            if (parsed.schema && parsed.root) {
                const rootNode: QueryGroup = parsed.root
                if (rootNode.type !== "group" || !Array.isArray(rootNode.children) || !rootNode.logic) {
                    return "Invalid query structure — root must be a group with logic and children"
                }
                if (!validateNode(rootNode)) {
                    return "Invalid query — one or more rules are missing field, operator, or value"
                }
                const preset: StarterPreset = {
                    id: "import",
                    name: "Imported query",
                    description: "",
                    schema: parsed.schema,
                    root: rootNode,
                }
                loadStarterPreset(preset)
                return null
            }

            if (parsed.type !== "group" || !Array.isArray(parsed.children) || !parsed.logic) {
                return "Invalid query structure — root must be a group with logic and children"
            }
            if (!validateNode(parsed)) {
                return "Invalid query — one or more rules are missing field, operator, or value"
            }
            importQuery(parsed as QueryGroup)
            return null
        } catch {
            return "Invalid JSON — please check your input"
        }
    }, [importQuery, loadStarterPreset])

    return { exportQuery, importFromJSON }
}
