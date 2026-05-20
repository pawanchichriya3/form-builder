"use client"

import * as React from "react"
import Link from "next/link"

import { AppSidebar } from "~/components/app-sidebar"
import { ChartAreaInteractive } from "~/components/chart-area-interactive"
import { DataTable } from "~/components/data-table"
import { SectionCards } from "~/components/section-cards"
import { SiteHeader } from "~/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "~/components/ui/sidebar"

import data from "../data.json"
import CreateFormModal from "~/components/create-form-modal"
import { useListForms } from "~/hooks/api/form"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "~/components/ui/table"

export default function Page() {
  const { forms, isLoading } = useListForms()
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Forms</h2>
                    <CreateFormModal />
                  </div>

                  <div className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {isLoading && (
                          <TableRow>
                            <TableCell colSpan={4}>Loading…</TableCell>
                          </TableRow>
                        )}

                        {forms?.map((form: any) => (
                          <TableRow key={form.id}>
                            <TableCell>{form.title}</TableCell>
                            <TableCell className="max-w-sm truncate">
                              {form.description}
                            </TableCell>
                            <TableCell>
                              {new Date(form.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Link href={`/dashboard/forms/${form.id}`} className="text-primary underline">
                                Edit
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
          </div>
        </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
