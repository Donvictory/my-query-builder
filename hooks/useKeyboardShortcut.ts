import { useEffect } from "react"
import { useQueryStore } from "@/store/query-store"

export function useKeyboardShortcut(onExecute: () => void) {
    const undo = useQueryStore((s) => s.undo)

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.ctrlKey && e.key === "Enter") {
                e.preventDefault()
                onExecute()
            }
            if (e.ctrlKey && e.key === "z") {
                e.preventDefault()
                undo()
            }
        }
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [onExecute, undo])
}