"use client"

import * as React from "react"
import { useParams } from "next/navigation"

import { toast } from "sonner"

import { useGetFormById } from "~/hooks/api/form"
import { useSubmitForm } from "~/hooks/api/form-submission"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { Switch } from "~/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

export default function PublicFormPage() {
  const params = useParams()
  const formId = params?.form_id as string | undefined
  const { form, isLoading, isError } = useGetFormById(formId ?? "")
  const { submitFormAsync, status: submitStatus } = useSubmitForm()

  const [values, setValues] = React.useState<Record<string, string | boolean>>({})
  const [submitted, setSubmitted] = React.useState(false)

  function handleChange(fieldId: string, value: string | boolean) {
    setValues((prev) => ({ ...prev, [fieldId]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formId || !form) return
    try {
      const fieldValues = form.fields.map((field: any) => ({
        formFieldId: field.id,
        value: String(values[field.id] ?? ""),
      }))
      await submitFormAsync({ formId, values: fieldValues })
      toast.success("Response submitted")
      setSubmitted(true)
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to submit form")
    }
  }

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading…</div>
  if (isError || !form) return <div className="flex items-center justify-center min-h-screen text-destructive">Form not found.</div>

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle>Thank you!</CardTitle>
            <CardDescription>Your response has been recorded.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{form.title}</CardTitle>
          {form.description && <CardDescription>{form.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {form.fields.map((field: any) => (
              <div key={field.id} className="grid gap-1.5">
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.isRequired && <span className="text-destructive ml-1">*</span>}
                </Label>

                {field.description && (
                  <p className="text-xs text-muted-foreground">{field.description}</p>
                )}

                {field.type === "YES_NO" ? (
                  <div className="flex items-center gap-2">
                    <Switch
                      id={field.id}
                      checked={!!values[field.id]}
                      onCheckedChange={(checked) => handleChange(field.id, checked)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {values[field.id] ? "Yes" : "No"}
                    </span>
                  </div>
                ) : (
                  <Input
                    id={field.id}
                    type={field.type === "NUMBER" ? "number" : field.type === "EMAIL" ? "email" : field.type === "PASSWORD" ? "password" : "text"}
                    placeholder={field.placeholder ?? ""}
                    required={field.isRequired}
                    value={(values[field.id] as string) ?? ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                )}
              </div>
            ))}

            <Button type="submit" className="mt-2" disabled={submitStatus === "pending"}>
              {submitStatus === "pending" ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
