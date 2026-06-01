"use client"

import { QueryGroup as QueryGroupType, QueryNode } from "@/lib/schema/type"
import { useQueryStore } from "@/store/query-store"
import { QueryRule } from "./QueryRule"
import { Button } from "@/components/ui/button"
import {
    ChevronDown,
    ChevronRight,
    Plus,
    Layers,
    Trash2,
} from "lucide-react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"

const DEPTH_COLORS = [
    "border-blue-400",
    "border-purple-400",
    "border-amber-400",
    "border-green-400",
    "border-pink-400",
]

interface Props {
    node: QueryGroupType
    depth?: number
    isRoot?: boolean
}

export function QueryGroup({ node, depth = 0, isRoot = false }: Props) {
    const addRule = useQueryStore((s) => s.addRule)
    const addGroup = useQueryStore((s) => s.addGroup)
    const removeNode = useQueryStore((s) => s.removeNode)
    const toggleLogic = useQueryStore((s) => s.toggleLogic)
    const toggleCollapse = useQueryStore((s) => s.toggleCollapse)
    const moveNode = useQueryStore((s) => s.moveNode)
    const validationErrors = useQueryStore((s) => s.validationErrors)

    const groupError = validationErrors.find((e) => e.nodeId === node.id)
    const borderColor = DEPTH_COLORS[depth % DEPTH_COLORS.length]

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return
        const oldIndex = node.children.findIndex((c) => c.id === active.id)
        const newIndex = node.children.findIndex((c) => c.id === over.id)
        if (oldIndex !== -1 && newIndex !== -1) {
            moveNode(String(active.id), node.id, newIndex)
        }
    }

    return (
        <div className={`border-l-2 ${borderColor} pl-3 mb-3`}>
            {/* Group header */}
            <div className="flex items-center gap-2 mb-2">
                {/* Collapse toggle */}
                <button
                    onClick={() => toggleCollapse(node.id)}
                    className="text-muted-foreground hover:text-foreground"
                >
                    {node.collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                </button>

                {/* AND / OR toggle */}
                <button
                    onClick={() => toggleLogic(node.id)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${node.logic === "AND"
                            ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                >
                    {node.logic}
                </button>

                <span className="text-xs text-muted-foreground">
                    {isRoot ? "Root group" : `Nested group (depth ${depth})`}
                </span>

                {/* Delete group — not root */}
                {!isRoot && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive ml-auto"
                        onClick={() => removeNode(node.id)}
                    >
                        <Trash2 size={12} />
                    </Button>
                )}
            </div>

            {/* Group error */}
            {groupError && (
                <p className="text-xs text-destructive mb-2 ml-4">{groupError.message}</p>
            )}

            {/* Children — collapsible */}
            {!node.collapsed && (
                <div>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={node.children.map((c) => c.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {node.children.map((child: QueryNode) =>
                                child.type === "rule" ? (
                                    <QueryRule key={child.id} node={child} parentId={node.id} />
                                ) : (
                                    <QueryGroup key={child.id} node={child} depth={depth + 1} />
                                )
                            )}
                        </SortableContext>
                    </DndContext>

                    {/* Add rule / Add group */}
                    <div className="flex gap-2 mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() => addRule(node.id)}
                        >
                            <Plus size={12} /> Add rule
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() => addGroup(node.id)}
                        >
                            <Layers size={12} /> Add group
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}