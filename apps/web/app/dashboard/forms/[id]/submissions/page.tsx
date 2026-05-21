"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { useGetFields } from "~/hooks/api/form-field"
import { useGetSubmissions } from "~/hooks/api/form-submission"
import { useListForms } from "~/hooks/api/form"
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

  // Sort fields by index for consistent column order
  const sortedFields = React.useMemo(
    () => [...(fields ?? [])].sort((a: any, b: any) => a.index - b.index),
    [fields]
  )

  if (isLoading) return <div className="flex items-center justify-center p-12 text-muted-foreground">Loading…</div>

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/dashboard/forms/${formId}`}>
          <Button variant="ghost" size="icon" className="size-8 hover:bg-primary/5">
            <ArrowLeftIcon className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Submissions</h1>
          {form && <p className="text-sm text-muted-foreground">{form.title}</p>}
        </div>
      </div>

      {(!submissions || submissions.length === 0) ? (
        <div className="rounded-xl border border-dashed border-border/60 p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-10 mx-auto text-muted-foreground/40 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
          <p className="text-muted-foreground text-sm">No submissions yet. Share your form to start collecting responses.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="w-12 font-semibold">#</TableHead>
                {sortedFields.map((field: any) => (
                  <TableHead key={field.id} className="font-semibold">{field.label}</TableHead>
                ))}
                <TableHead className="font-semibold">Submitted At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission: any, idx: number) => {
                const valueMap: Record<string, string> = {}
                for (const v of submission.value) {
                  valueMap[v.formFieldId] = v.value
                }

                return (
                  <TableRow key={submission.id} className="border-border/40 hover:bg-primary/3 transition-colors">
                    <TableCell className="font-medium text-primary/80">{idx + 1}</TableCell>
                    {sortedFields.map((field: any) => (
                      <TableCell key={field.id}>
                        {field.type === "YES_NO"
                          ? valueMap[field.id] === "true"
                            ? <span className="text-chart-2 font-medium">Yes</span>
                            : <span className="text-muted-foreground">No</span>
                          : valueMap[field.id] ?? <span className="text-muted-foreground">—</span>}
                      </TableCell>
                    ))}
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(submission.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
