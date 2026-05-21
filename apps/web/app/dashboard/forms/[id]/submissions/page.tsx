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

  if (isLoading) return <div className="p-6">Loading…</div>

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <Link href={`/dashboard/forms/${formId}`}>
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowLeftIcon className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Submissions</h1>
          {form && <p className="text-sm text-muted-foreground">{form.title}</p>}
        </div>
      </div>

      {(!submissions || submissions.length === 0) ? (
        <p className="text-muted-foreground text-sm">No submissions yet.</p>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                {sortedFields.map((field: any) => (
                  <TableHead key={field.id}>{field.label}</TableHead>
                ))}
                <TableHead>Submitted At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission: any, idx: number) => {
                // Build a lookup from fieldId → value for this submission
                const valueMap: Record<string, string> = {}
                for (const v of submission.value) {
                  valueMap[v.formFieldId] = v.value
                }

                return (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    {sortedFields.map((field: any) => (
                      <TableCell key={field.id}>
                        {field.type === "YES_NO"
                          ? valueMap[field.id] === "true" ? "Yes" : "No"
                          : valueMap[field.id] ?? "—"}
                      </TableCell>
                    ))}
                    <TableCell className="text-muted-foreground">
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
