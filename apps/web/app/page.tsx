"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useUser } from "~/hooks/api/auth"
import { SummitMark } from "~/components/brand"

export default function Home() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (user?.id) router.replace("/dashboard")
    else router.replace("/login")
  }, [user, isLoading, router])

  return (
    <main className="relative grid min-h-svh place-items-center bg-background overflow-hidden">
      <div className="absolute inset-0 mesh opacity-80" aria-hidden />
      <div className="absolute inset-0 line-grid opacity-40" aria-hidden />
      <div className="relative z-10 flex flex-col items-center gap-4 fade-up">
        <span className="text-primary">
          <SummitMark size={44} />
        </span>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-base font-semibold tracking-tight">Summit Forms</h1>
          <p className="text-xs text-muted-foreground">Preparing your workspace…</p>
        </div>
        <div className="mt-2 flex gap-1">
          <span className="size-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.3s]" />
          <span className="size-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]" />
          <span className="size-1.5 rounded-full bg-primary/70 animate-bounce" />
        </div>
      </div>
    </main>
  )
}
