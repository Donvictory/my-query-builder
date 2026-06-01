import { useCallback } from "react"
import { useQueryStore } from "@/store/query-store"
import { executeQuery } from "@/lib/query-engine/executor"
import { validateTree } from "@/lib/query-engine/validator"
import { MOCK_DATA } from "@/lib/schema/mock-data"

export function useQueryExecution() {
    const root = useQueryStore((s) => s.root)
    const schema = useQueryStore((s) => s.schema)
    const selectedSchema = useQueryStore((s) => s.selectedSchema)
    const setResults = useQueryStore((s) => s.setResults)
    const setExecuting = useQueryStore((s) => s.setExecuting)
    const setValidationErrors = useQueryStore((s) => s.setValidationErrors)

    const execute = useCallback(() => {
        const errors = validateTree(root, schema)
        setValidationErrors(errors)
        if (errors.length > 0) return false


        const store = useQueryStore.getState()
        const newHistory = [
            ...store.history.slice(-9),
            JSON.parse(JSON.stringify(root)),
        ]
        useQueryStore.setState({ history: newHistory })

        setExecuting(true)
        setTimeout(() => {
            const dataset = MOCK_DATA[selectedSchema] ?? []
            const results = executeQuery(root, dataset)
            setResults(results)
            setExecuting(false)
        }, 500)

        return true
    }, [root, schema, selectedSchema])

    return { execute }
}