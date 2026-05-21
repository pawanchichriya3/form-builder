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

  if (isLoading) return <div className="flex items-center justify-center min-h-screen text-muted-foreground">Loading…</div>
  if (isError || !form) return <div className="flex items-center justify-center min-h-screen text-destructive">Form not found.</div>

  if (submitted) {
    return (
      <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
        <div className="absolute inset-0 mountain-bg">
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 300" fill="none" preserveAspectRatio="none">
            <path d="M0 300V220L240 140L480 200L720 80L960 160L1200 60L1440 140V300H0Z" fill="oklch(0.16 0.035 260 / 50%)" />
            <path d="M0 300V260L300 190L600 250L900 170L1200 230L1440 210V300H0Z" fill="oklch(0.12 0.025 260 / 70%)" />
          </svg>
        </div>
        <Card className="relative z-10 w-full max-w-lg mountain-glass border-white/10 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-chart-2 to-chart-2/70 shadow-lg shadow-chart-2/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <CardTitle className="text-xl text-white">Thank you!</CardTitle>
            <CardDescription className="text-white/60">Your response has been recorded successfully.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden">
      {/* Mountain background */}
      <div className="absolute inset-0 mountain-bg">
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 300" fill="none" preserveAspectRatio="none">
          <path d="M0 300V220L240 140L480 200L720 80L960 160L1200 60L1440 140V300H0Z" fill="oklch(0.16 0.035 260 / 50%)" />
          <path d="M0 300V260L300 190L600 250L900 170L1200 230L1440 210V300H0Z" fill="oklch(0.12 0.025 260 / 70%)" />
        </svg>
        <div className="absolute top-[10%] left-[15%] size-1 rounded-full bg-white/40 animate-pulse" />
        <div className="absolute top-[8%] left-[50%] size-1.5 rounded-full bg-white/30 animate-pulse [animation-delay:1s]" />
        <div className="absolute top-[15%] left-[80%] size-1 rounded-full bg-white/35 animate-pulse [animation-delay:0.5s]" />
      </div>
      <Card className="relative z-10 w-full max-w-lg mountain-glass border-white/10 shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
            </div>
            <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Summit Forms</span>
          </div>
          <CardTitle className="text-xl text-white">{form.title}</CardTitle>
          {form.description && <CardDescription className="text-white/60">{form.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {form.fields.map((field: any) => (
              <div key={field.id} className="grid gap-1.5">
                <Label htmlFor={field.id} className="text-white/90">
                  {field.label}
                  {field.isRequired && <span className="text-destructive ml-1">*</span>}
                </Label>

                {field.description && (
                  <p className="text-xs text-white/40">{field.description}</p>
                )}

                {field.type === "YES_NO" ? (
                  <div className="flex items-center gap-2">
                    <Switch
                      id={field.id}
                      checked={!!values[field.id]}
                      onCheckedChange={(checked) => handleChange(field.id, checked)}
                    />
                    <span className="text-sm text-white/60">
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
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-primary/50"
                  />
                )}
              </div>
            ))}

            <Button type="submit" className="mt-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" disabled={submitStatus === "pending"}>
              {submitStatus === "pending" ? "Submitting..." : "Submit Response"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
