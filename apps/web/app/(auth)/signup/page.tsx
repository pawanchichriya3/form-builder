import Link from "next/link"
import { BrandLockup } from "~/components/brand"
import { ThemeToggle } from "~/components/theme-toggle"
import { SignupForm } from "~/components/signup-form"

export default function SignupPage() {
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
              <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
              <p className="text-sm text-muted-foreground">
                Start building forms in under a minute. No credit card required.
              </p>
            </div>
            <SignupForm />
            <p className="mt-8 text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Summit Forms · Forms, refined.
        </p>
      </div>

      {/* Right — feature panel */}
      <aside className="relative hidden overflow-hidden border-l border-border bg-muted/30 lg:block">
        <div className="absolute inset-0 mesh" aria-hidden />
        <div className="absolute inset-0 dotted-grid opacity-60" aria-hidden />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" />
            Free for personal use
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight">
                Forms that <span className="brand-text">scale with you</span>.
              </h2>
              <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
                A monorepo-grade form platform with end-to-end TypeScript, JSONB-backed
                schema-on-read storage, and a polished editor that respects your time.
              </p>
            </div>

            <ul className="space-y-4">
              {[
                { t: "Type-safe by default", d: "tRPC + Zod from API to component." },
                { t: "Public sharing", d: "One URL, zero authentication required for respondents." },
                { t: "Schema-on-read", d: "Edit forms freely without breaking historic submissions." },
                { t: "Modern stack", d: "Next.js 16, React 19, Drizzle, PostgreSQL." },
              ].map((f) => (
                <li key={f.t} className="flex items-start gap-3">
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                    <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">{f.t}</div>
                    <div className="text-xs text-muted-foreground">{f.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  )
}
