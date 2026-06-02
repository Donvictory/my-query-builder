import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook } from "@testing-library/react"
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut"
import { useQueryStore } from "@/store/query-store"
import { QueryGroup } from "@/lib/schema/type"

const BASE_ROOT: QueryGroup = {
    type: "group",
    id: "root-kb",
    logic: "AND",
    children: [],
    collapsed: false,
}

beforeEach(() => {
    localStorage.clear()
    useQueryStore.setState({
        root: { ...BASE_ROOT },
        history: [],
        historyIndex: -1,
        results: [],
        validationErrors: [],
        hasExecuted: false,
        isExecuting: false,
    })
})

afterEach(() => {
    vi.restoreAllMocks()
})

describe("useKeyboardShortcut — Ctrl+Enter", () => {
    it("calls the execute callback when Ctrl+Enter is pressed", () => {
        const execute = vi.fn()
        renderHook(() => useKeyboardShortcut(execute))

        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", ctrlKey: true, bubbles: true }))

        expect(execute).toHaveBeenCalledTimes(1)
    })

    it("does not call execute when only Enter is pressed (no Ctrl)", () => {
        const execute = vi.fn()
        renderHook(() => useKeyboardShortcut(execute))

        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", ctrlKey: false, bubbles: true }))

        expect(execute).not.toHaveBeenCalled()
    })

    it("does not call execute when Ctrl+Z is pressed", () => {
        const execute = vi.fn()
        renderHook(() => useKeyboardShortcut(execute))

        window.dispatchEvent(new KeyboardEvent("keydown", { key: "z", ctrlKey: true, bubbles: true }))

        expect(execute).not.toHaveBeenCalled()
    })

    it("calls execute multiple times on repeated Ctrl+Enter", () => {
        const execute = vi.fn()
        renderHook(() => useKeyboardShortcut(execute))

        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", ctrlKey: true, bubbles: true }))
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", ctrlKey: true, bubbles: true }))

        expect(execute).toHaveBeenCalledTimes(2)
    })
})

describe("useKeyboardShortcut — Ctrl+Z (undo)", () => {
    it("triggers store undo when Ctrl+Z is pressed", () => {
        const v1: QueryGroup = { ...BASE_ROOT, id: "v1", logic: "AND" }
        const v2: QueryGroup = { ...BASE_ROOT, id: "v2", logic: "OR" }
        useQueryStore.setState({ history: [v1, v2], historyIndex: 1, root: v2 })

        renderHook(() => useKeyboardShortcut(vi.fn()))
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "z", ctrlKey: true, bubbles: true }))

        expect(useQueryStore.getState().historyIndex).toBe(0)
        expect(useQueryStore.getState().root.id).toBe("v1")
    })

    it("does not undo when Ctrl+Z is pressed but history is empty", () => {
        useQueryStore.setState({ history: [], historyIndex: -1 })

        renderHook(() => useKeyboardShortcut(vi.fn()))
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "z", ctrlKey: true, bubbles: true }))

        expect(useQueryStore.getState().historyIndex).toBe(-1)
    })

    it("does not trigger undo when only Z is pressed (no Ctrl)", () => {
        const v1: QueryGroup = { ...BASE_ROOT, id: "v1" }
        const v2: QueryGroup = { ...BASE_ROOT, id: "v2" }
        useQueryStore.setState({ history: [v1, v2], historyIndex: 1, root: v2 })

        renderHook(() => useKeyboardShortcut(vi.fn()))
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "z", ctrlKey: false, bubbles: true }))

        expect(useQueryStore.getState().historyIndex).toBe(1)
    })
})

describe("useKeyboardShortcut — cleanup", () => {
    it("removes the event listener on unmount", () => {
        const execute = vi.fn()
        const removeEventListenerSpy = vi.spyOn(window, "removeEventListener")

        const { unmount } = renderHook(() => useKeyboardShortcut(execute))
        unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function))
    })
})