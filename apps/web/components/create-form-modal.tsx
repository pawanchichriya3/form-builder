"use client"

import * as React from "react"
import { toast } from "sonner"

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

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { useCreateForm } from "~/hooks/api/form"

export function CreateFormModal() {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")

  const { createFormAsync, status } = useCreateForm()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      await createFormAsync({ title, description })
      toast.success("Form created")
      setOpen(false)
      setTitle("")
      setDescription("")
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to create form")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">New form</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <form id="create-form" onSubmit={onSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Create a new form</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a title and optional description for the new form.
            </AlertDialogDescription>

            <div className="mt-4 grid gap-2">
              <div>
                <Label htmlFor="form-title">Title</Label>
                <Input
                  id="form-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="form-description">Description</Label>
                <Textarea
                  id="form-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>

            <Button type="submit" form="create-form" disabled={status === "loading"}>
              {status === "loading" ? "Creating..." : "Create"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateFormModal
