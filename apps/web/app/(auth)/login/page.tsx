import Link from "next/link"
import { BrandLockup } from "~/components/brand"
import { ThemeToggle } from "~/components/theme-toggle"
import { LoginForm } from "~/components/login-form"

export default function LoginPage() {
  return (
    <div className="relative grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
      {/* Left — form */}
      <div className="relative flex flex-col px-6 py-8 md:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Summit Forms home">
            <BrandLockup size="md" />
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm fade-up">
            <div className="mb-8 space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to continue building beautiful forms.
              </p>
            </div>
            <LoginForm />
            <p className="mt-8 text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
                Create one
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Summit Forms · Forms, refined.
        </p>
      </div>

      {/* Right — marketing panel */}
      <aside className="relative hidden overflow-hidden border-l border-border bg-muted/30 lg:block">
        <div className="absolute inset-0 mesh" aria-hidden />
        <div className="absolute inset-0 dotted-grid opacity-60" aria-hidden />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" />
            All systems operational
          </div>

          <div className="space-y-6">
            <blockquote className="space-y-4">
              <p className="text-2xl font-medium leading-relaxed tracking-tight text-foreground">
                &ldquo;Summit Forms replaced three of our tools. The end-to-end type safety alone saved us a sprint.&rdquo;
              </p>
              <footer className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  AR
                </div>
                <div className="text-sm">
                  <div className="font-medium">Avery Ramos</div>
                  <div className="text-muted-foreground">Engineering Lead, Anchor Labs</div>
                </div>
              </footer>
            </blockquote>

            <div className="hairline-x" />

            <ul className="grid grid-cols-2 gap-4 text-sm">
              {[
                { k: "Type-safe", v: "DB → UI" },
                { k: "p95 latency", v: "< 80ms" },
                { k: "Uptime", v: "99.98%" },
                { k: "Schema-on-read", v: "JSONB" },
              ].map((s) => (
                <li key={s.k} className="rounded-lg border border-border/70 bg-card/60 p-3 backdrop-blur-sm">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.k}</div>
                  <div className="mt-1 font-medium tabular-nums">{s.v}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  )
}
