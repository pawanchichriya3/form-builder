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

  if (isLoading) return <div className="p-6">Loading…</div>
  if (!form) return (
    <div className="p-6">
      <p>Form not found.</p>
      <Link href="/dashboard/forms" className="text-primary underline">Back</Link>
    </div>
  )

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Edit form</h1>
      </div>

      <div className="grid gap-4 max-w-2xl">
        <div>
          <Label>Title</Label>
          <h3>{form.title}</h3>
        </div>

        <div>
          <Label>Description</Label>
          <h3>{form.description}</h3>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Fields</h2>

          <AlertDialog open={addOpen} onOpenChange={setAddOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" size="sm">
                <PlusIcon className="size-4 mr-1" /> Add field
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <form id="add-field-form" onSubmit={handleAddField}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Add a new field</AlertDialogTitle>
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
                  <Button type="submit" form="add-field-form" disabled={createStatus === "pending"}>
                    {createStatus === "pending" ? "Adding..." : "Add field"}
                  </Button>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {fieldsLoading && <p className="text-muted-foreground text-sm">Loading fields…</p>}

        {fields && fields.length === 0 && (
          <p className="text-muted-foreground text-sm">No fields yet. Add one above.</p>
        )}

        {fields?.map((field: any) => (
          <div key={field.id} className="rounded-lg border p-4 grid gap-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{field.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground rounded bg-muted px-2 py-0.5">
                  {field.type}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive"
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
