import Link from "next/link"
import { ArrowRightIcon, PlusIcon } from "lucide-react"

import { AppSidebar } from "~/components/app-sidebar"
import { ChartAreaInteractive } from "~/components/chart-area-interactive"
import { SectionCards } from "~/components/section-cards"
import { SiteHeader } from "~/components/site-header"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import { Button } from "~/components/ui/button"

export default function DashboardPage() {
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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-6 py-6 md:gap-8 md:py-8">
              {/* Page header */}
              <div className="flex flex-col gap-3 px-4 lg:px-6 sm:flex-row sm:items-end sm:justify-between fade-up">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Overview</p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight">Welcome back</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Here&apos;s a snapshot of your forms over the last 30 days.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="h-9 gap-2">
                    <Link href="/dashboard/forms">
                      View all forms <ArrowRightIcon className="size-3.5" />
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="h-9 gap-2">
                    <Link href="/dashboard/forms">
                      <PlusIcon className="size-4" />
                      New form
                    </Link>
                  </Button>
                </div>
              </div>

              <SectionCards />

              <div className="px-4 lg:px-6">
                <div className="rounded-xl border border-border bg-card p-4 elevate sm:p-6">
                  <div className="mb-4 flex items-baseline justify-between">
                    <div>
                      <h2 className="text-base font-semibold tracking-tight">Submission volume</h2>
                      <p className="text-xs text-muted-foreground">Responses received across all forms.</p>
                    </div>
                  </div>
                  <ChartAreaInteractive />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
