"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRightIcon, SearchIcon } from "lucide-react"

import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { ThemeToggle } from "~/components/theme-toggle"
import { Button } from "~/components/ui/button"

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  forms: "Forms",
  submissions: "Submissions",
}

function humanise(segment: string) {
  if (labelMap[segment]) return labelMap[segment]
  // UUID-like segments: collapse
  if (/^[0-9a-f-]{8,}$/i.test(segment)) return "Detail"
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}

export function SiteHeader() {
  const pathname = usePathname() ?? ""
  const segments = pathname.split("/").filter(Boolean)

  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border bg-background/80 backdrop-blur-md transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1 size-8" />
        <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-sm">
          {segments.map((seg, i) => {
            const href = "/" + segments.slice(0, i + 1).join("/")
            const isLast = i === segments.length - 1
            return (
              <React.Fragment key={href}>
                {i > 0 && <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground/60" />}
                {isLast ? (
                  <span className="truncate font-medium text-foreground">{humanise(seg)}</span>
                ) : (
                  <Link
                    href={href}
                    className="truncate text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {humanise(seg)}
                  </Link>
                )}
              </React.Fragment>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="hidden h-8 gap-2 rounded-md border border-border bg-card px-2.5 text-xs text-muted-foreground hover:text-foreground md:inline-flex"
          >
            <SearchIcon className="size-3.5" />
            <span>Search</span>
            <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
