"use client"
import { QueryRule as QueryRuleType } from "@/lib/schema/type"
import { useQueryStore } from "@/store/query-store"
import { OPERATORS_BY_TYPE, OPERATOR_LABELS } from "@/lib/schema/operator-map"
import { ValueInput } from "./ValueInput"
import { Button } from "@/components/ui/button"
import { Trash2, GripVertical, ChevronDown, AlertCircle } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface Props {
    node: QueryRuleType
    parentId: string
}

export function QueryRule({ node, parentId }: Props) {
    const schema = useQueryStore((s) => s.schema)
    const updateRule = useQueryStore((s) => s.updateRule)
    const removeNode = useQueryStore((s) => s.removeNode)
    const validationErrors = useQueryStore((s) => s.validationErrors)

    const error = validationErrors.find((e) => e.nodeId === node.id)
    const fieldDef = schema[node.field]
    const availableOperators = fieldDef ? OPERATORS_BY_TYPE[fieldDef.type] : []

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: node.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    }

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`group/rule flex flex-col gap-1 mb-2.5 p-2 rounded-lg border border-border/40 bg-card/60 dark:bg-card/30 hover:bg-card hover:border-border/80 dark:hover:bg-card/50 transition-all duration-200 ${
                isDragging ? "shadow-md scale-[1.01] border-brand-primary/40 bg-muted/40" : ""
            }`}
        >
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {/* Grab Drag handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="h-7 w-5 cursor-grab rounded-md flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/80 transition-colors"
                    title="Drag to reorder condition"
                >
                    <GripVertical size={13} />
                </button>

                {/* Styled Field Selector Dropdown */}
                <div className="relative flex items-center h-7 border border-border/80 hover:border-border rounded-lg bg-background text-sm text-foreground min-w-[120px] transition-colors focus-within:ring-1 focus-within:ring-brand-primary/80 focus-within:border-brand-primary">
                    <select
                        value={node.field}
                        onChange={(e) => updateRule(node.id, { field: e.target.value })}
                        className="appearance-none bg-transparent pr-7 pl-2.5 py-1 text-sm w-full font-medium focus:outline-none cursor-pointer text-ellipsis overflow-hidden"
                    >
                        {Object.values(schema).map((f) => (
                            <option key={f.key} value={f.key}>
                                {f.label}
                            </option>
                        ))}
                    </select>
                    <span className="absolute right-2 text-muted-foreground/60 pointer-events-none">
                        <ChevronDown size={11} />
                    </span>
                </div>

                {/* Styled Operator Selector Dropdown */}
                <div className="relative flex items-center h-7 border border-border/80 hover:border-border rounded-lg bg-background text-sm text-foreground min-w-[130px] transition-colors focus-within:ring-1 focus-within:ring-brand-primary/80 focus-within:border-brand-primary">
                    <select
                        value={node.operator}
                        onChange={(e) => updateRule(node.id, { operator: e.target.value as any })}
                        className="appearance-none bg-transparent pr-7 pl-2.5 py-1 text-sm w-full font-medium focus:outline-none cursor-pointer text-ellipsis overflow-hidden"
                    >
                        {availableOperators.map((op) => (
                            <option key={op} value={op}>
                                {OPERATOR_LABELS[op]}
                            </option>
                        ))}
                    </select>
                    <span className="absolute right-2 text-muted-foreground/60 pointer-events-none">
                        <ChevronDown size={11} />
                    </span>
                </div>

                {/* Value Input — Dynamic rendering depending on Schema type */}
                <div className="flex-1 min-w-[140px]">
                    <ValueInput
                        fieldDef={fieldDef}
                        operator={node.operator}
                        value={node.value}
                        onChange={(value) => updateRule(node.id, { value })}
                    />
                </div>

                {/* Delete button (Smooth red indicator on hover) */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg text-muted-foreground/80 hover:text-destructive hover:bg-destructive/5 sm:opacity-0 group-hover/rule:opacity-100 transition-all duration-200 ml-auto"
                    onClick={() => removeNode(node.id)}
                    title="Delete condition"
                >
                    <Trash2 size={12} />
                </Button>
            </div>

            {/* Structured validation warning bar */}
            {error && (
                <div className="flex items-center gap-1 text-sm text-destructive font-medium pl-6 py-0.5 animate-fade-in">
                    <AlertCircle size={10} />
                    <span>{error.message}</span>
                </div>
            )}
        </div>
    )
}