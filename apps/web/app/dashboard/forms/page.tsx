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
                  <div className="flex items-center justify-between px-4 lg:px-6">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">Forms</h2>
                      <p className="text-sm text-muted-foreground">Manage and create your forms</p>
                    </div>
                    <CreateFormModal />
                  </div>

                  <div className="px-4 lg:px-6">
                    <div className="rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/60 hover:bg-transparent">
                          <TableHead className="font-semibold">Title</TableHead>
                          <TableHead className="font-semibold">Description</TableHead>
                          <TableHead className="font-semibold">Created</TableHead>
                          <TableHead className="font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {isLoading && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading…</TableCell>
                          </TableRow>
                        )}

                        {forms?.map((form: any) => (
                          <TableRow key={form.id} className="border-border/40 hover:bg-primary/3 transition-colors">
                            <TableCell className="font-medium">{form.title}</TableCell>
                            <TableCell className="max-w-sm truncate text-muted-foreground">
                              {form.description}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(form.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Link href={`/dashboard/forms/${form.id}`} className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors">
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
