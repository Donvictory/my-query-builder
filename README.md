# QueryCraft — Visual Query Builder

A highly interactive visual query builder that allows users to construct complex database queries through a graphical interface instead of writing raw query syntax manually.

---

## Features

- Visual rule and group builder with unlimited nesting depth
- AND/OR logic toggle per group
- Schema-driven rendering (string, number, enum, date, boolean)
- Live SQL and MongoDB query preview
- Mock data query execution with results table
- Drag and drop condition reordering
- Collapsible groups
- Query validation engine
- Save/load query presets
- Export/import query as JSON
- Undo support
- Dark/light mode
- Keyboard shortcuts (Ctrl+Enter to execute, Ctrl+Z to undo)
- 23 unit tests across generator, executor, and validator

---

## Architecture

### Folder Structure
├── app/                      # Next.js App Router
│   └── page.tsx              # Main page — wires everything together
├── components/
│   └── query-builder/        # All query builder UI components
│       ├── QueryGroup.tsx    # Recursive group component
│       ├── QueryRule.tsx     # Individual rule row
│       ├── ValueInput.tsx    # Schema-driven value input
│       ├── QueryPreview.tsx  # Live SQL/Mongo preview
│       ├── ResultsTable.tsx  # Query results display
│       └── SchemaPanel.tsx   # Schema fields + validation display
├── lib/
│   ├── schema/
│   │   ├── types.ts          # All TypeScript types
│   │   ├── schemas.ts        # Sample schemas (users, products, orders)
│   │   ├── operator-map.ts   # Valid operators per field type
│   │   └── mock-data.ts      # Mock datasets for query execution
│   └── query-engine/
│       ├── generator.ts      # Tree → SQL + Mongo output
│       ├── executor.ts       # Filters mock dataset against query tree
│       └── validator.ts      # Validates query tree structure
├── store/
│   └── query-store.ts        # Zustand store — all state and actions
└── tests/                # Vitest unit tests

---

## Recursive Rendering Strategy

The core of the application is a recursive data structure:

```typescript
type QueryNode =
  | { type: "rule"; id: string; field: string; operator: Operator; value: any }
  | { type: "group"; id: string; logic: "AND" | "OR"; children: QueryNode[] }
```

The `QueryGroup` component renders its children. If a child is a rule it renders `QueryRule`. If a child is a group it renders another `QueryGroup` — calling itself recursively. This supports unlimited nesting depth with no changes to the component code.

```tsx
{node.children.map((child) =>
  child.type === "rule"
    ? <QueryRule key={child.id} node={child} />
    : <QueryGroup key={child.id} node={child} depth={depth + 1} />
)}
```

The same recursive pattern is used in the query generator, executor, and validator — each traverses the tree by calling itself on every child node.

---

## State Management

Zustand with Immer middleware manages the entire query tree. All mutations use a `findAndMutate` helper that recursively traverses the tree to find a node by ID and apply a mutation in place.

Key design decisions:
- Single root `QueryGroup` node — the entire query is one tree
- All actions take a `nodeId` — no component needs to know its position in the tree
- Presets and schema selection are persisted to localStorage via Zustand persist middleware
- Immer handles immutable updates on deeply nested structures without spread hell

---

## Query Engine Design

### Generator (`generator.ts`)
Recursively traverses the query tree and produces either SQL or MongoDB syntax. Groups wrap their children with AND/OR logic. Nested groups are wrapped in parentheses in SQL output.

### Executor (`executor.ts`)
Filters a mock dataset by recursively evaluating each node against each row. AND groups require all children to match. OR groups require at least one child to match.

### Validator (`validator.ts`)
Recursively validates the tree and returns an array of `ValidationError` objects with the `nodeId` of the offending node. Errors are displayed inline next to the relevant rule or group in the UI.

---

## Performance Optimization

- Zustand selectors — every component subscribes only to the slice of state it needs, preventing unnecessary re-renders
- Immer middleware — immutable updates without manual spreading of nested objects
- `useCallback` on the execute handler to prevent recreation on every render
- DnD Kit used for drag and drop — uses pointer events and is optimized for large lists
- Validation runs on demand (on execute) not on every keystroke

---

## Trade-offs

- Drag and drop is scoped within a group only — cross-group dragging was omitted to reduce complexity
- SQL output targets PostgreSQL dialect specifically
- Mock dataset is static JSON — no real database connection
- Query history tracks presets only, not every individual change
- Test coverage focuses on the three pure function modules (generator, executor, validator) rather than UI components

---

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand + Immer
- DnD Kit
- Vitest + Testing Library

---

## Running Locally

```bash
npm install
npm run dev
```

## Running Tests

```bash
npm test
```