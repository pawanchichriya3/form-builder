"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

import { useListForms } from "~/hooks/api/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"

export default function EditFormPage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const { forms, isLoading } = useListForms()

  const form = forms?.find((f: any) => f.id === id)

  if (isLoading) return <div>Loading…</div>
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

        
      </div>
    </div>
  )
}
