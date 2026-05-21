"use client"

import * as React from "react"
import Link from "next/link"
import { format } from "date-fns"
import { FileTextIcon, ExternalLinkIcon, MoreHorizontalIcon, BarChart3Icon, PencilIcon } from "lucide-react"

import { AppSidebar } from "~/components/app-sidebar"
import { SiteHeader } from "~/components/site-header"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import { useListForms } from "~/hooks/api/form"
import CreateFormModal from "~/components/create-form-modal"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { cn } from "~/lib/utils"

function formatDate(d: string | Date) {
  try {
    return format(new Date(d), "MMM d, yyyy")
  } catch {
    return ""
  }
}

export default function FormsListPage() {
  const { forms, isLoading } = useListForms()
  const [query, setQuery] = React.useState("")

  const filtered = React.useMemo(() => {
    if (!forms) return []
    const q = query.trim().toLowerCase()
    if (!q) return forms
    return forms.filter((f: any) =>
      [f.title, f.description].some((v) => String(v ?? "").toLowerCase().includes(q)),
    )
  }, [forms, query])

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
          <div className="flex flex-col gap-3 px-4 lg:px-6 sm:flex-row sm:items-end sm:justify-between fade-up">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Workspace</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Forms</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage, edit and share your forms.
              </p>
            </div>
            <CreateFormModal />
          </div>

          {/* Toolbar */}
          <div className="mt-6 px-4 lg:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-xs flex-1">
                <Input
                  placeholder="Search forms…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-9 pl-9"
                />
                <svg
                  viewBox="0 0 24 24"
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <div className="text-xs text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "form" : "forms"}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="mt-4 px-4 lg:px-6">
            {isLoading ? (
              <SkeletonGrid />
            ) : filtered.length === 0 ? (
              <EmptyState hasForms={!!forms?.length} />
            ) : (
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((form: any) => (
                  <li
                    key={form.id}
                    className={cn(
                      "group relative rounded-xl border border-border bg-card p-5 elevate lift hover:border-border/80",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/dashboard/forms/${form.id}`} className="flex min-w-0 items-start gap-3">
                        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <FileTextIcon className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium tracking-tight">{form.title}</div>
                          <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {form.description || "No description"}
                          </div>
                        </div>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <MoreHorizontalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/forms/${form.id}`}>
                              <PencilIcon className="size-3.5" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/forms/${form.id}/submissions`}>
                              <BarChart3Icon className="size-3.5" /> Submissions
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <a href={`/form/${form.id}`} target="_blank" rel="noreferrer">
                              <ExternalLinkIcon className="size-3.5" /> Open public
                            </a>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-border/80 pt-3 text-xs text-muted-foreground">
                      <span>Updated {formatDate(form.updatedAt ?? form.createdAt)}</span>
                      <Link
                        href={`/dashboard/forms/${form.id}`}
                        className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary"
                      >
                        Open <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function SkeletonGrid() {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 rounded shimmer" />
              <div className="h-2 w-1/2 rounded shimmer" />
            </div>
          </div>
          <div className="mt-5 h-2 w-1/3 rounded shimmer" />
        </li>
      ))}
    </ul>
  )
}

function EmptyState({ hasForms }: { hasForms: boolean }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
        <FileTextIcon className="size-5" />
      </div>
      <h3 className="mt-4 text-sm font-medium">
        {hasForms ? "No matching forms" : "Create your first form"}
      </h3>
      <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
        {hasForms
          ? "Try a different search term."
          : "Forms are blank canvases — add fields, share the link, and watch responses roll in."}
      </p>
      {!hasForms && (
        <div className="mt-4">
          <CreateFormModal />
        </div>
      )}
    </div>
  )
}
