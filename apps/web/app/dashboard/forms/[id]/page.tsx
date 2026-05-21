"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { Trash2Icon, PlusIcon } from "lucide-react"

import { useListForms } from "~/hooks/api/form"
import { useGetFields, useCreateField, useUpdateField, useDeleteField } from "~/hooks/api/form-field"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { Switch } from "~/components/ui/switch"
import { Separator } from "~/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "~/components/ui/alert-dialog"

const FIELD_TYPES = ["TEXT", "NUMBER", "EMAIL", "PASSWORD", "YES_NO"] as const

export default function EditFormPage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const { forms, isLoading } = useListForms()
  const { fields, isLoading: fieldsLoading } = useGetFields(id ?? "")
  const { createFieldAsync, status: createStatus } = useCreateField()
  const { updateFieldAsync } = useUpdateField()
  const { deleteFieldAsync } = useDeleteField()

  const [addOpen, setAddOpen] = React.useState(false)
  const [newLabel, setNewLabel] = React.useState("")
  const [newType, setNewType] = React.useState<(typeof FIELD_TYPES)[number]>("TEXT")
  const [newRequired, setNewRequired] = React.useState(false)
  const [newDescription, setNewDescription] = React.useState("")
  const [newPlaceholder, setNewPlaceholder] = React.useState("")

  const form = forms?.find((f: any) => f.id === id)

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
      type?: (typeof FIELD_TYPES)[number]
      isRequired?: boolean
      description?: string
      placeholder?: string
    }
  ) {
    try {
      await updateFieldAsync({ fieldId, ...updates })
      toast.success("Field updated")
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update field")
    }
  }

  if (isLoading) return <div className="flex items-center justify-center p-12 text-muted-foreground">Loading…</div>
  if (!form) return (
    <div className="p-6">
      <p className="text-muted-foreground">Form not found.</p>
      <Link href="/dashboard/forms" className="text-primary hover:text-primary/80 underline-offset-4 hover:underline">Back to forms</Link>
    </div>
  )

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <Link href="/dashboard/forms" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 inline-block">← Back to forms</Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit Form</h1>
      </div>

      <div className="grid gap-5 max-w-2xl">
        <div className="rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Title</Label>
              <h3 className="text-lg font-semibold mt-1">{form.title}</h3>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Description</Label>
              <h3 className="text-sm text-muted-foreground mt-1">{form.description || "—"}</h3>
            </div>
          </div>
        </div>

        <Separator className="opacity-60" />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Fields</h2>

          <AlertDialog open={addOpen} onOpenChange={setAddOpen}>
            <AlertDialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 shadow-sm shadow-primary/15 hover:shadow-primary/25 transition-all">
                <PlusIcon className="size-4 mr-1" /> Add Field
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="border-border/60 shadow-xl">
              <form id="add-field-form" onSubmit={handleAddField}>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-bold tracking-tight">Add a new field</AlertDialogTitle>
                  <AlertDialogDescription>
                    Configure the field properties below.
                  </AlertDialogDescription>

                  <div className="mt-4 grid gap-3">
                    <div>
                      <Label htmlFor="field-label">Label</Label>
                      <Input
                        id="field-label"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="field-type">Type</Label>
                      <Select value={newType} onValueChange={(v) => setNewType(v as typeof newType)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELD_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="field-placeholder">Placeholder</Label>
                      <Input
                        id="field-placeholder"
                        value={newPlaceholder}
                        onChange={(e) => setNewPlaceholder(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="field-description">Description</Label>
                      <Textarea
                        id="field-description"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        id="field-required"
                        checked={newRequired}
                        onCheckedChange={setNewRequired}
                      />
                      <Label htmlFor="field-required">Required</Label>
                    </div>
                  </div>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="outline" type="button">Cancel</Button>
                  </AlertDialogCancel>
                  <Button type="submit" form="add-field-form" disabled={createStatus === "pending"} className="bg-gradient-to-r from-primary to-primary/80">
                    {createStatus === "pending" ? "Adding..." : "Add Field"}
                  </Button>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {fieldsLoading && <p className="text-muted-foreground text-sm py-4 text-center">Loading fields…</p>}

        {fields && fields.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/60 p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-10 mx-auto text-muted-foreground/40 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
            <p className="text-muted-foreground text-sm">No fields yet. Add your first field to get started.</p>
          </div>
        )}

        {fields?.map((field: any) => (
          <div key={field.id} className="rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm p-4 grid gap-3 shadow-sm hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{field.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-primary/80 rounded-full bg-primary/8 px-2.5 py-0.5">
                  {field.type}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteField(field.id)}
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Label</Label>
                <Input
                  defaultValue={field.label}
                  onBlur={(e) => {
                    if (e.target.value !== field.label) {
                      handleUpdateField(field.id, { label: e.target.value })
                    }
                  }}
                />
              </div>

              <div>
                <Label className="text-xs">Type</Label>
                <Select
                  defaultValue={field.type}
                  onValueChange={(v) => handleUpdateField(field.id, { type: v as typeof newType })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Placeholder</Label>
                <Input
                  defaultValue={field.placeholder ?? ""}
                  onBlur={(e) => {
                    if (e.target.value !== (field.placeholder ?? "")) {
                      handleUpdateField(field.id, { placeholder: e.target.value })
                    }
                  }}
                />
              </div>

              <div>
                <Label className="text-xs">Description</Label>
                <Input
                  defaultValue={field.description ?? ""}
                  onBlur={(e) => {
                    if (e.target.value !== (field.description ?? "")) {
                      handleUpdateField(field.id, { description: e.target.value })
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={field.isRequired}
                onCheckedChange={(checked) => handleUpdateField(field.id, { isRequired: checked })}
              />
              <Label className="text-xs">Required</Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
