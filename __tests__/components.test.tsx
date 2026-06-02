import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { useQueryStore } from "@/store/query-store"
import { SCHEMAS } from "@/lib/schema/schemas"
import { QueryGroup as QueryGroupType, QueryRule as QueryRuleType } from "@/lib/schema/type"

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
    useReducedMotion: () => false,
}))


vi.mock("@dnd-kit/core", () => ({
    DndContext: ({ children }: any) => <>{children}</>,
    closestCenter: vi.fn(),
    KeyboardSensor: vi.fn(),
    PointerSensor: vi.fn(),
    useSensor: vi.fn(),
    useSensors: vi.fn(() => []),
}))

vi.mock("@dnd-kit/sortable", () => ({
    SortableContext: ({ children }: any) => <>{children}</>,
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
        isDragging: false,
    }),
    sortableKeyboardCoordinates: vi.fn(),
    verticalListSortingStrategy: vi.fn(),
}))

vi.mock("@dnd-kit/utilities", () => ({
    CSS: { Transform: { toString: () => "" } },
}))


import { QueryGroup } from "@/components/query-builder/QueryGroup"
import { QueryRule } from "@/components/query-builder/QueryRule"

const RULE: QueryRuleType = {
    type: "rule",
    id: "rule-1",
    field: "status",
    operator: "equals",
    value: "active",
}

const ROOT_WITH_RULE: QueryGroupType = {
    type: "group",
    id: "root-comp",
    logic: "AND",
    collapsed: false,
    children: [RULE],
}

const NESTED_ROOT: QueryGroupType = {
    type: "group",
    id: "root-nested",
    logic: "AND",
    collapsed: false,
    children: [
        {
            type: "group",
            id: "child-group",
            logic: "OR",
            collapsed: false,
            children: [RULE],
        },
    ],
}

beforeEach(() => {
    localStorage.clear()
    useQueryStore.setState({
        root: ROOT_WITH_RULE,
        schema: SCHEMAS.users,
        selectedSchema: "users",
        validationErrors: [],
        hasExecuted: false,
        isExecuting: false,
        results: [],
        history: [],
        historyIndex: -1,
        presets: [],
    })
})



describe("QueryRule", () => {
    it("renders without crashing", () => {
        render(<QueryRule node={RULE} parentId="root-comp" />)
    })

    it("renders a field select with the rule's field as value", () => {
        render(<QueryRule node={RULE} parentId="root-comp" />)
        const selects = screen.getAllByRole("combobox")
        const fieldSelect = selects[0] as HTMLSelectElement
        expect(fieldSelect.value).toBe("status")
    })

    it("renders an operator select with the rule's operator as value", () => {
        render(<QueryRule node={RULE} parentId="root-comp" />)
        const selects = screen.getAllByRole("combobox")
        const operatorSelect = selects[1] as HTMLSelectElement
        expect(operatorSelect.value).toBe("equals")
    })

    it("renders a delete button", () => {
        render(<QueryRule node={RULE} parentId="root-comp" />)
        const deleteButton = screen.getByTitle("Delete condition")
        expect(deleteButton).toBeInTheDocument()
    })

    it("shows a validation error message when one exists for this rule", () => {
        useQueryStore.setState({
            validationErrors: [{ nodeId: "rule-1", message: "Value is required" }],
        })
        render(<QueryRule node={RULE} parentId="root-comp" />)
        expect(screen.getByText("Value is required")).toBeInTheDocument()
    })

    it("does not show error message when no validation error exists", () => {
        useQueryStore.setState({ validationErrors: [] })
        render(<QueryRule node={RULE} parentId="root-comp" />)
        expect(screen.queryByText("Value is required")).not.toBeInTheDocument()
    })
})



describe("QueryGroup", () => {
    it("renders without crashing", () => {
        render(<QueryGroup node={ROOT_WITH_RULE} depth={0} isRoot={true} />)
    })

    it("shows 'Root group' label when isRoot is true", () => {
        render(<QueryGroup node={ROOT_WITH_RULE} depth={0} isRoot={true} />)
        expect(screen.getByText("Root group")).toBeInTheDocument()
    })

    it("shows depth label when isRoot is false", () => {
        const nested: QueryGroupType = { ...ROOT_WITH_RULE, id: "nested-g" }
        render(<QueryGroup node={nested} depth={2} isRoot={false} />)
        expect(screen.getByText("Nested group (depth 2)")).toBeInTheDocument()
    })

    it("renders AND logic button by default", () => {
        render(<QueryGroup node={ROOT_WITH_RULE} depth={0} isRoot={true} />)
        expect(screen.getByText("AND")).toBeInTheDocument()
    })

    it("renders OR logic button when logic is OR", () => {
        const orRoot: QueryGroupType = { ...ROOT_WITH_RULE, logic: "OR" }
        render(<QueryGroup node={orRoot} depth={0} isRoot={true} />)
        expect(screen.getByText("OR")).toBeInTheDocument()
    })

    it("renders Add rule and Add group buttons", () => {
        render(<QueryGroup node={ROOT_WITH_RULE} depth={0} isRoot={true} />)
        expect(screen.getByText("Add rule")).toBeInTheDocument()
        expect(screen.getByText("Add group")).toBeInTheDocument()
    })

    it("does not show a delete button for root group", () => {
        render(<QueryGroup node={ROOT_WITH_RULE} depth={0} isRoot={true} />)
        expect(screen.queryByTitle("Remove entire group")).not.toBeInTheDocument()
    })

    it("shows a delete button for non-root groups", () => {
        const nested: QueryGroupType = { ...ROOT_WITH_RULE, id: "nested-del" }
        render(<QueryGroup node={nested} depth={1} isRoot={false} />)
        expect(screen.getByTitle("Remove entire group")).toBeInTheDocument()
    })

    it("renders child rules inside the group", () => {
        render(<QueryGroup node={ROOT_WITH_RULE} depth={0} isRoot={true} />)
        // The field select of the child QueryRule should be present
        const selects = screen.getAllByRole("combobox")
        const fieldSelect = selects[0] as HTMLSelectElement
        expect(fieldSelect.value).toBe("status")
    })

    it("renders nested groups recursively", () => {
        render(<QueryGroup node={NESTED_ROOT} depth={0} isRoot={true} />)
        // Nested group has depth=1 so it shows "Nested group (depth 1)"
        expect(screen.getByText("Nested group (depth 1)")).toBeInTheDocument()
        // AND for root, OR for nested
        expect(screen.getByText("AND")).toBeInTheDocument()
        expect(screen.getByText("OR")).toBeInTheDocument()
    })

    it("does not render children when collapsed", () => {
        const collapsed: QueryGroupType = { ...ROOT_WITH_RULE, collapsed: true }
        render(<QueryGroup node={collapsed} depth={0} isRoot={true} />)
        expect(screen.queryByText("Add rule")).not.toBeInTheDocument()
    })
})