"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeftIcon, DownloadIcon, InboxIcon, Loader2 } from "lucide-react"

import { useGetFields } from "~/hooks/api/form-field"
import { useGetSubmissions } from "~/hooks/api/form-submission"
import { useListForms } from "~/hooks/api/form"

import { AppSidebar } from "~/components/app-sidebar"
import { SiteHeader } from "~/components/site-header"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import { Button } from "~/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"

export default function SubmissionsPage() {
  const params = useParams()
  const formId = params?.id as string | undefined

  const { forms } = useListForms()
  const { fields, isLoading: fieldsLoading } = useGetFields(formId ?? "")
  const { submissions, isLoading: submissionsLoading } = useGetSubmissions(formId ?? "")

  const form = forms?.find((f: any) => f.id === formId)
  const isLoading = fieldsLoading || submissionsLoading

  const sortedFields = React.useMemo(
    () => [...(fields ?? [])].sort((a: any, b: any) => a.index - b.index),
    [fields],
  )

  function exportCsv() {
    if (!submissions || submissions.length === 0) return
    const header = ["#", ...sortedFields.map((f: any) => f.label), "Submitted At"]
    const rows = submissions.map((s: any, i: number) => {
      const map: Record<string, string> = {}
      for (const v of s.value) map[v.formFieldId] = v.value
      return [
        String(i + 1),
        ...sortedFields.map((f: any) => map[f.id] ?? ""),
        new Date(s.createdAt).toISOString(),
      ]
    })
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${form?.title ?? "submissions"}.csv`
    a.click()
    URL.revokeObjectURL(url)
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
          {/* Header */}
          <div className="flex flex-col gap-4 px-4 lg:px-6 fade-up">
            <Link
              href={`/dashboard/forms/${formId}`}
              className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeftIcon className="size-3.5" /> Back to form
            </Link>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Responses</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">Submissions</h1>
                {form && <p className="mt-1 text-sm text-muted-foreground">{form.title}</p>}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">
                  {submissions?.length ?? 0} total
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 gap-2"
                  onClick={exportCsv}
                  disabled={!submissions || submissions.length === 0}
                >
                  <DownloadIcon className="size-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="mt-6 px-4 lg:px-6">
            {isLoading ? (
              <div className="flex items-center justify-center rounded-xl border border-border bg-card p-16 text-sm text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" /> Loading submissions…
              </div>
            ) : !submissions || submissions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <InboxIcon className="size-5" />
                </div>
                <h3 className="mt-4 text-sm font-medium">No submissions yet</h3>
                <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
                  Share your form to start collecting responses.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-card elevate">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
                        <TableHead className="w-12 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          #
                        </TableHead>
                        {sortedFields.map((field: any) => (
                          <TableHead
                            key={field.id}
                            className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                          >
                            {field.label}
                          </TableHead>
                        ))}
                        <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Submitted
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission: any, idx: number) => {
                        const valueMap: Record<string, string> = {}
                        for (const v of submission.value) valueMap[v.formFieldId] = v.value
                        return (
                          <TableRow key={submission.id} className="border-b border-border/60 last:border-0">
                            <TableCell className="text-xs font-medium tabular-nums text-muted-foreground">
                              {idx + 1}
                            </TableCell>
                            {sortedFields.map((field: any) => (
                              <TableCell key={field.id} className="max-w-xs truncate text-sm">
                                {field.type === "YES_NO" ? (
                                  valueMap[field.id] === "true" ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-xs font-medium text-success">
                                      Yes
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                      No
                                    </span>
                                  )
                                ) : (
                                  valueMap[field.id] ?? <span className="text-muted-foreground">—</span>
                                )}
                              </TableCell>
                            ))}
                            <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                              {format(new Date(submission.createdAt), "MMM d, yyyy · h:mm a")}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
