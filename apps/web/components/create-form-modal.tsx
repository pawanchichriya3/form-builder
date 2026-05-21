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
        <Button className="bg-gradient-to-r from-primary to-primary/80 shadow-md shadow-primary/15 hover:shadow-primary/25 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          New Form
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border-border/60 shadow-xl">
        <form id="create-form" onSubmit={onSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold tracking-tight">Create a new form</AlertDialogTitle>
            <AlertDialogDescription>
              Give your form a title and optional description to get started.
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

            <Button type="submit" form="create-form" disabled={status === "loading"} className="bg-gradient-to-r from-primary to-primary/80">
              {status === "loading" ? "Creating..." : "Create Form"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateFormModal
