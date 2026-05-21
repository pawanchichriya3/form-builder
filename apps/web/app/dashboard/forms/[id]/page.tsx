"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import {
  Trash2Icon,
  PlusIcon,
  ArrowLeftIcon,
  CopyIcon,
  ExternalLinkIcon,
  BarChart3Icon,
  GripVerticalIcon,
  Type as TypeIcon,
  Hash as HashIcon,
  Mail as MailIcon,
  Lock as LockIcon,
  ToggleLeft as ToggleIcon,
  Loader2,
} from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"

import { useListForms } from "~/hooks/api/form"
import {
  useGetFields,
  useCreateField,
  useUpdateField,
  useDeleteField,
  useReorderFields,
} from "~/hooks/api/form-field"

import { AppSidebar } from "~/components/app-sidebar"
import { SiteHeader } from "~/components/site-header"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { Switch } from "~/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { cn } from "~/lib/utils"

const FIELD_TYPES = ["TEXT", "NUMBER", "EMAIL", "PASSWORD", "YES_NO"] as const
type FieldType = (typeof FIELD_TYPES)[number]

const FIELD_TYPE_META: Record<
  FieldType,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  TEXT: { label: "Text", icon: TypeIcon },
  NUMBER: { label: "Number", icon: HashIcon },
  EMAIL: { label: "Email", icon: MailIcon },
  PASSWORD: { label: "Password", icon: LockIcon },
  YES_NO: { label: "Yes / No", icon: ToggleIcon },
}

export default function EditFormPage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const { forms, isLoading } = useListForms()
  const { fields, isLoading: fieldsLoading } = useGetFields(id ?? "")
  const { createFieldAsync, status: createStatus } = useCreateField()
  const { updateFieldAsync } = useUpdateField()
  const { deleteFieldAsync } = useDeleteField()
  const { reorderFieldsAsync } = useReorderFields()

  const [addOpen, setAddOpen] = React.useState(false)
  const [newLabel, setNewLabel] = React.useState("")
  const [newType, setNewType] = React.useState<FieldType>("TEXT")
  const [newRequired, setNewRequired] = React.useState(false)
  const [newDescription, setNewDescription] = React.useState("")
  const [newPlaceholder, setNewPlaceholder] = React.useState("")

  // Local ordering state for optimistic DnD
  const [orderedFields, setOrderedFields] = React.useState<any[]>([])
  React.useEffect(() => {
    if (fields) {
      setOrderedFields([...fields].sort((a: any, b: any) => a.index - b.index))
    }
  }, [fields])

  const form = forms?.find((f: any) => f.id === id)
  const publicUrl =
    typeof window !== "undefined" && id ? `${window.location.origin}/form/${id}` : ""

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function resetAddForm() {
    setNewLabel("")
    setNewType("TEXT")
    setNewRequired(false)
    setNewDescription("")
    setNewPlaceholder("")
  }

  async function handleAddField(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    try {
      await createFieldAsync({
        formId: id,
        label: newLabel,
        type: newType,
        isRequired: newRequired,
        description: newDescription || undefined,
        placeholder: newPlaceholder || undefined,
      })
      toast.success("Field added")
      setAddOpen(false)
      resetAddForm()
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to add field")
    }
  }

  async function handleDeleteField(fieldId: string) {
    try {
      await deleteFieldAsync({ fieldId })
      toast.success("Field deleted")
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete field")
    }
  }

  async function handleUpdateField(
    fieldId: string,
    updates: {
      label?: string
      type?: FieldType
      isRequired?: boolean
      description?: string
      placeholder?: string
    }
  ) {
    try {
      await updateFieldAsync({ fieldId, ...updates })
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update field")
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id || !id) return

    const oldIndex = orderedFields.findIndex((f: any) => f.id === active.id)
    const newIndex = orderedFields.findIndex((f: any) => f.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    // Optimistic local reorder
    const reordered = arrayMove(orderedFields, oldIndex, newIndex)
    setOrderedFields(reordered)

    // Persist to server
    try {
      await reorderFieldsAsync({ formId: id, fieldIds: reordered.map((f: any) => f.id) })
    } catch (err: any) {
      // Revert on failure
      setOrderedFields(orderedFields)
      toast.error(err?.message ?? "Failed to reorder fields")
    }
  }

  function copyShareLink() {
    if (!publicUrl) return
    navigator.clipboard.writeText(publicUrl).then(() => toast.success("Link copied"))
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col py-6 md:py-8">
          {isLoading ? (
            <div className="flex items-center justify-center px-4 py-16 text-sm text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" /> Loading form…
            </div>
          ) : !form ? (
            <div className="px-4 py-16 lg:px-6">
              <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
                <p className="text-sm text-muted-foreground">Form not found.</p>
                <Link
                  href="/dashboard/forms"
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Back to forms
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-col gap-4 px-4 lg:px-6 fade-up">
                <Link
                  href="/dashboard/forms"
                  className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeftIcon className="size-3.5" /> All forms
                </Link>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0">
                    <h1 className="truncate text-2xl font-semibold tracking-tight">
                      {form.title}
                    </h1>
                    {form.description && (
                      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                        {form.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm" className="h-9 gap-2">
                      <Link href={`/dashboard/forms/${id}/submissions`}>
                        <BarChart3Icon className="size-4" />
                        Submissions
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="h-9 gap-2">
                      <a href={`/form/${id}`} target="_blank" rel="noreferrer">
                        <ExternalLinkIcon className="size-4" />
                        Preview
                      </a>
                    </Button>
                  </div>
                </div>
                {/* Share link bar */}
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-1.5">
                  <span className="grid size-7 place-items-center rounded bg-card text-muted-foreground">
                    <ExternalLinkIcon className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
                    {publicUrl || "—"}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-xs"
                    onClick={copyShareLink}
                  >
                    <CopyIcon className="size-3.5" />
                    Copy
                  </Button>
                </div>
              </div>

              {/* Fields */}
              <div className="mt-8 px-4 lg:px-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold tracking-tight">Fields</h2>
                    <p className="text-xs text-muted-foreground">
                      Drag to reorder. Changes save automatically.
                    </p>
                  </div>
                  <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="h-9 gap-2 font-medium">
                        <PlusIcon className="size-4" />
                        Add field
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <form onSubmit={handleAddField}>
                        <DialogHeader>
                          <DialogTitle>Add a new field</DialogTitle>
                          <DialogDescription>
                            Configure the field. You can refine it later.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-5 grid gap-4">
                          <div className="grid gap-2">
                            <Label
                              htmlFor="field-label"
                              className="text-xs font-medium text-muted-foreground"
                            >
                              Label
                            </Label>
                            <Input
                              id="field-label"
                              value={newLabel}
                              onChange={(e) => setNewLabel(e.target.value)}
                              required
                              autoFocus
                              className="h-10"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Type
                            </Label>
                            <Select
                              value={newType}
                              onValueChange={(v) => setNewType(v as FieldType)}
                            >
                              <SelectTrigger className="h-10 w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {FIELD_TYPES.map((t) => {
                                  const Icon = FIELD_TYPE_META[t].icon
                                  return (
                                    <SelectItem key={t} value={t}>
                                      <span className="flex items-center gap-2">
                                        <Icon className="size-3.5 text-muted-foreground" />
                                        {FIELD_TYPE_META[t].label}
                                      </span>
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label
                              htmlFor="field-placeholder"
                              className="text-xs font-medium text-muted-foreground"
                            >
                              Placeholder
                            </Label>
                            <Input
                              id="field-placeholder"
                              value={newPlaceholder}
                              onChange={(e) => setNewPlaceholder(e.target.value)}
                              className="h-10"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label
                              htmlFor="field-description"
                              className="text-xs font-medium text-muted-foreground"
                            >
                              Helper text
                            </Label>
                            <Textarea
                              id="field-description"
                              value={newDescription}
                              onChange={(e) => setNewDescription(e.target.value)}
                              rows={2}
                            />
                          </div>
                          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-3">
                            <div>
                              <Label className="text-sm">Required</Label>
                              <p className="text-xs text-muted-foreground">
                                Block submission if empty.
                              </p>
                            </div>
                            <Switch checked={newRequired} onCheckedChange={setNewRequired} />
                          </div>
                        </div>
                        <DialogFooter className="mt-6">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setAddOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={createStatus === "pending"}
                            className="gap-2"
                          >
                            {createStatus === "pending" && (
                              <Loader2 className="size-4 animate-spin" />
                            )}
                            {createStatus === "pending" ? "Adding…" : "Add field"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {fieldsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-24 rounded-xl border border-border bg-card shimmer"
                      />
                    ))}
                  </div>
                ) : !orderedFields || orderedFields.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
                    <div className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                      <PlusIcon className="size-5" />
                    </div>
                    <h3 className="mt-4 text-sm font-medium">No fields yet</h3>
                    <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
                      Add your first field — text, number, email, password, or yes/no.
                    </p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={orderedFields.map((f: any) => f.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <ul className="space-y-3">
                        {orderedFields.map((field: any, idx: number) => (
                          <SortableFieldCard
                            key={field.id}
                            field={field}
                            idx={idx}
                            onDelete={handleDeleteField}
                            onUpdate={handleUpdateField}
                          />
                        ))}
                      </ul>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

/* ─────────────────────────────────────────────────────────────
   Sortable Field Card
   ───────────────────────────────────────────────────────────── */

function SortableFieldCard({
  field,
  idx,
  onDelete,
  onUpdate,
}: {
  field: any
  idx: number
  onDelete: (id: string) => void
  onUpdate: (
    id: string,
    updates: {
      label?: string
      type?: FieldType
      isRequired?: boolean
      description?: string
      placeholder?: string
    }
  ) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: "relative",
  }

  const Icon = FIELD_TYPE_META[field.type as FieldType]?.icon ?? TypeIcon

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-xl border border-border bg-card p-5 elevate",
        isDragging && "shadow-lg ring-2 ring-primary/20 opacity-95"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {/* Drag handle */}
          <button
            type="button"
            className="grid size-9 shrink-0 cursor-grab place-items-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground active:cursor-grabbing"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
          >
            <GripVerticalIcon className="size-4" />
          </button>
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium tracking-tight">
                {field.label}
              </span>
              {field.isRequired && (
                <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive">
                  required
                </span>
              )}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              Field {idx + 1} · {FIELD_TYPE_META[field.type as FieldType]?.label}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(field.id)}
          aria-label="Delete field"
        >
          <Trash2Icon className="size-4" />
        </Button>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Label</Label>
          <Input
            defaultValue={field.label}
            onBlur={(e) => {
              if (e.target.value !== field.label)
                onUpdate(field.id, { label: e.target.value })
            }}
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Type</Label>
          <Select
            defaultValue={field.type}
            onValueChange={(v) => onUpdate(field.id, { type: v as FieldType })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FIELD_TYPES.map((t) => {
                const I = FIELD_TYPE_META[t].icon
                return (
                  <SelectItem key={t} value={t}>
                    <span className="flex items-center gap-2">
                      <I className="size-3.5 text-muted-foreground" />
                      {FIELD_TYPE_META[t].label}
                    </span>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Placeholder</Label>
          <Input
            defaultValue={field.placeholder ?? ""}
            onBlur={(e) => {
              if (e.target.value !== (field.placeholder ?? ""))
                onUpdate(field.id, { placeholder: e.target.value })
            }}
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Helper text</Label>
          <Input
            defaultValue={field.description ?? ""}
            onBlur={(e) => {
              if (e.target.value !== (field.description ?? ""))
                onUpdate(field.id, { description: e.target.value })
            }}
          />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between rounded-lg border border-border bg-muted/40 p-3">
        <div>
          <Label className="text-sm">Required</Label>
          <p className="text-xs text-muted-foreground">Block submission if empty.</p>
        </div>
        <Switch
          checked={field.isRequired}
          onCheckedChange={(checked) => onUpdate(field.id, { isRequired: checked })}
        />
      </div>
    </li>
  )
}
