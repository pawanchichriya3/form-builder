"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { CheckIcon, Loader2 } from "lucide-react"

import { useGetFormById } from "~/hooks/api/form"
import { useSubmitForm } from "~/hooks/api/form-submission"

import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { Switch } from "~/components/ui/switch"
import { BrandLockup } from "~/components/brand"
import { ThemeToggle } from "~/components/theme-toggle"

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

  if (isLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" /> Loading form…
        </div>
      </Shell>
    )
  }

  if (isError || !form) {
    return (
      <Shell>
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <h2 className="text-base font-semibold">Form not found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The form may have been deleted or the link is incorrect.
          </p>
        </div>
      </Shell>
    )
  }

  if (submitted) {
    return (
      <Shell>
        <div className="rounded-2xl border border-border bg-card p-10 text-center elevate-lg fade-up">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success">
            <CheckIcon className="size-7" />
          </div>
          <h2 className="mt-5 text-xl font-semibold tracking-tight">Thank you!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your response has been recorded.
          </p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="rounded-2xl border border-border bg-card elevate-lg fade-up">
        {/* Form header */}
        <div className="border-b border-border px-6 py-5 sm:px-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">Form</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">{form.title}</h1>
          {form.description && (
            <p className="mt-2 text-sm text-muted-foreground">{form.description}</p>
          )}
        </div>

        {/* Fields */}
        <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8 sm:py-8">
          <div className="grid gap-6">
            {form.fields.map((field: any) => (
              <div key={field.id} className="grid gap-2">
                <Label htmlFor={field.id} className="text-sm font-medium">
                  {field.label}
                  {field.isRequired && <span className="ml-1 text-destructive">*</span>}
                </Label>

                {field.description && (
                  <p className="text-xs text-muted-foreground">{field.description}</p>
                )}

                {field.type === "YES_NO" ? (
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">
                      {values[field.id] ? "Yes" : "No"}
                    </span>
                    <Switch
                      id={field.id}
                      checked={!!values[field.id]}
                      onCheckedChange={(checked) => handleChange(field.id, checked)}
                    />
                  </div>
                ) : (
                  <Input
                    id={field.id}
                    type={
                      field.type === "NUMBER"
                        ? "number"
                        : field.type === "EMAIL"
                          ? "email"
                          : field.type === "PASSWORD"
                            ? "password"
                            : "text"
                    }
                    placeholder={field.placeholder ?? ""}
                    required={field.isRequired}
                    value={(values[field.id] as string) ?? ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="h-10"
                  />
                )}
              </div>
            ))}

            <Button
              type="submit"
              className="mt-2 h-11 gap-2 text-sm font-medium"
              disabled={submitStatus === "pending"}
            >
              {submitStatus === "pending" && <Loader2 className="size-4 animate-spin" />}
              {submitStatus === "pending" ? "Submitting…" : "Submit response"}
            </Button>
          </div>
        </form>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-svh bg-background">
      <div className="absolute inset-x-0 top-0 h-64 mesh opacity-70" aria-hidden />
      <div className="relative mx-auto flex min-h-svh w-full max-w-2xl flex-col px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between">
          <BrandLockup size="sm" />
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-start justify-center py-12">
          <div className="w-full">{children}</div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Powered by{" "}
          <a href="/" className="font-medium text-foreground hover:underline">
            Summit Forms
          </a>
        </p>
      </div>
    </div>
  )
}
