"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, PlusIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { useCreateForm } from "~/hooks/api/form"

export function CreateFormModal() {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const router = useRouter()

  const { createFormAsync, status } = useCreateForm()
  const isLoading = status === "pending"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const result = await createFormAsync({ title, description })
      toast.success("Form created")
      setOpen(false)
      setTitle("")
      setDescription("")
      if (result?.id) router.push(`/dashboard/forms/${result.id}`)
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to create form")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 gap-2 font-medium shadow-sm">
          <PlusIcon className="size-4" />
          New form
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new form</DialogTitle>
            <DialogDescription>
              Give your form a clear name. You can add fields after.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="form-title" className="text-xs font-medium text-muted-foreground">
                Title
              </Label>
              <Input
                id="form-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Customer onboarding survey"
                required
                autoFocus
                className="h-10"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="form-description" className="text-xs font-medium text-muted-foreground">
                Description <span className="text-muted-foreground/60">(optional)</span>
              </Label>
              <Textarea
                id="form-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this form for?"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              {isLoading ? "Creating…" : "Create form"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFormModal
