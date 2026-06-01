"use client"
import { AnimatePresence, motion } from "framer-motion"
import { QueryGroup as QueryGroupType, QueryNode } from "@/lib/schema/type"
import { useQueryStore } from "@/store/query-store"
import { QueryRule } from "./QueryRule"
import { Button } from "@/components/ui/button"
import {
    ChevronDown,
    Plus,
    Layers,
    Trash2
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

interface Props {
    node: QueryGroupType
    depth?: number
    isRoot?: boolean
}

// Map the global CSS depth variables to static Tailwind borders and backgrounds (no inline styles)
const DEPTH_BORDER_CLASSES = [
    "border-l-depth-0",
    "border-l-depth-1",
    "border-l-depth-2",
    "border-l-depth-3",
    "border-l-depth-4"
]

const DEPTH_BG_CLASSES = [
    "bg-depth-0",
    "bg-depth-1",
    "bg-depth-2",
    "bg-depth-3",
    "bg-depth-4"
]

export function QueryGroup({ node, depth = 0, isRoot = false }: Props) {
    const addRule = useQueryStore((s) => s.addRule)
    const addGroup = useQueryStore((s) => s.addGroup)
    const removeNode = useQueryStore((s) => s.removeNode)
    const toggleLogic = useQueryStore((s) => s.toggleLogic)
    const toggleCollapse = useQueryStore((s) => s.toggleCollapse)
    const moveNode = useQueryStore((s) => s.moveNode)
    const validationErrors = useQueryStore((s) => s.validationErrors)

    const groupError = validationErrors.find((e) => e.nodeId === node.id)

    const borderClass = DEPTH_BORDER_CLASSES[depth % 5]
    const bgClass = DEPTH_BG_CLASSES[depth % 5]

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            }
        }),
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
        <div
            className={`border-l-[3px] ${borderClass} pl-4 sm:pl-5 mb-4 relative transition-all duration-300 ${isRoot
                ? "bg-muted/5 rounded-r-xl p-3 sm:p-4"
                : "bg-card/10 hover:bg-card/30 rounded-r-lg py-1.5"
                }`}
        >
            {/* Visual connector dot representing parent anchor */}
            <span
                className={`absolute left-[-5.5px] top-[14px] w-2.5 h-2.5 rounded-full border-2 border-background ${bgClass}`}
            />

            {/* Group Header */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
                {/* Collapse caret button */}
                <button
                    onClick={() => toggleCollapse(node.id)}
                    className="h-5 w-5 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
                >
                    <ChevronDown
                        size={14}
                        className={`transform transition-transform duration-200 ${node.collapsed ? "-rotate-90" : "rotate-0"}`}
                    />
                </button>

                {/* AND/OR Interactive Logic Pill */}
                <button
                    onClick={() => toggleLogic(node.id)}
                    className={`text-sm font-medium px-2.5 py-0.5 rounded-md border tracking-wider transition-all duration-200 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98] ${node.logic === "AND"
                        ? "bg-blue-50/70 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-900/60"
                        : "bg-amber-50/70 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-900/60"
                        }`}
                >
                    {node.logic}
                </button>

                <span className="text-sm font-semibold text-muted-foreground">
                    {isRoot ? "Root group" : `Nested group (depth ${depth})`}
                </span>

                {/* Validation Error banner inside group header */}
                {groupError && (
                    <span className="text-sm text-destructive font-medium bg-destructive/10 dark:bg-destructive/20 border border-destructive/20 rounded-md px-2 py-0.5 animate-pulse ml-2">
                        {groupError.message}
                    </span>
                )}

                {/* Delete button (Root cannot be deleted) */}
                {!isRoot && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/5 ml-auto transition-colors"
                        onClick={() => removeNode(node.id)}
                        title="Remove entire group"
                    >
                        <Trash2 size={12} />
                    </Button>
                )}
            </div>

            {/* Group Content area */}
            <AnimatePresence initial={false}>
                {!node.collapsed && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <div className="flex flex-col gap-1.5 pl-1.5">
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
                        </div>

                        {/* Interactive Add Action Buttons */}
                        <div className="flex items-center gap-1.5 mt-3 pl-1.5">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-[34px] px-4 text-sm font-medium gap-1.5 bg-background hover:bg-muted border-border/80 text-muted-foreground hover:text-foreground transition-all"
                                onClick={() => addRule(node.id)}
                            >
                                <Plus size={11} className="text-brand-primary" /> Add rule
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-[34px] px-4 text-sm font-medium gap-1.5 bg-background hover:bg-muted border-border/80 text-muted-foreground hover:text-foreground transition-all"
                                onClick={() => addGroup(node.id)}
                            >
                                <Layers size={11} className="text-brand-accent" /> Add group
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}