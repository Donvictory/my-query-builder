"use client"

import { QueryRule as QueryRuleType } from "@/lib/schema/type"
import { useQueryStore } from "@/store/query-store"
import { OPERATORS_BY_TYPE, OPERATOR_LABELS } from "@/lib/schema/operator-map"
import { ValueInput } from "./ValueInput"
import { Button } from "@/components/ui/button"
import { Trash2, GripVertical } from "lucide-react"
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
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} className="flex flex-col gap-1 mb-2">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                {/* Drag handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab text-muted-foreground hover:text-foreground"
                >
                    <GripVertical size={14} />
                </button>

                {/* Field selector */}
                <select
                    value={node.field}
                    onChange={(e) => updateRule(node.id, { field: e.target.value })}
                    className="h-7 text-xs border rounded-md px-2 bg-background max-w-[100px] sm:max-w-none"
                >
                    {Object.values(schema).map((f) => (
                        <option key={f.key} value={f.key}>
                            {f.label}
                        </option>
                    ))}
                </select>

                {/* Operator selector */}
                <select
                    value={node.operator}
                    onChange={(e) => updateRule(node.id, { operator: e.target.value as any })}
                    className="h-7 text-xs border rounded-md px-2 bg-background max-w-[110px] sm:max-w-none"
                >
                    {availableOperators.map((op) => (
                        <option key={op} value={op}>
                            {OPERATOR_LABELS[op]}
                        </option>
                    ))}
                </select>

                {/* Value input — schema driven */}
                <ValueInput
                    fieldDef={fieldDef}
                    operator={node.operator}
                    value={node.value}
                    onChange={(value) => updateRule(node.id, { value })}
                />

                {/* Delete */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive ml-auto"
                    onClick={() => removeNode(node.id)}
                >
                    <Trash2 size={13} />
                </Button>
            </div>

            {/* Validation error */}
            {error && (
                <p className="text-xs text-destructive ml-6">{error.message}</p>
            )}
        </div>
    )
}