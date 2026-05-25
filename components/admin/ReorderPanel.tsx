'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Loader2 } from 'lucide-react'
import type { Doc } from '@/types'

function SortableItem({ doc, versionCount }: { doc: Pick<Doc, 'id' | 'title' | 'order_index'>; versionCount?: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: doc.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-background text-sm ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
    >
      <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground touch-none">
        <GripVertical className="w-4 h-4" />
      </button>
      <span className="font-mono text-xs text-muted-foreground w-6 text-right shrink-0">{doc.order_index}</span>
      <span className="truncate flex-1">{doc.title}</span>
      {versionCount !== undefined && (
        <span className="shrink-0 font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
          v{versionCount}
        </span>
      )}
    </div>
  )
}

export function ReorderPanel({ docs, category, versionCounts = {} }: { docs: Pick<Doc, 'id' | 'title' | 'order_index'>[]; category: string; versionCounts?: Record<string, number> }) {
  const [items, setItems] = useState(docs)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      order_index: idx,
    }))
    setItems(reordered)
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    await fetch('/api/docs/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items.map(({ id, order_index }) => ({ id, order_index })) }),
    })
    setSaving(false)
    setSaved(true)
  }

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((doc) => <SortableItem key={doc.id} doc={doc} versionCount={versionCounts[doc.id]} />)}
        </SortableContext>
      </DndContext>
      <button
        onClick={handleSave}
        disabled={saving || saved}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {saved ? 'Saved' : saving ? 'Saving…' : 'Save order'}
      </button>
    </div>
  )
}
