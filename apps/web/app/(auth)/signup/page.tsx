import { SignupForm } from "~/components/signup-form"

export default function SignupPage() {
  return (
    <div className="relative grid min-h-svh lg:grid-cols-2">
      {/* Left: form */}
      <div className="relative z-10 flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
            <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-md shadow-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/><path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"/></svg>
            </div>
            Summit Forms
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      {/* Right: mountain scene */}
      <div className="relative hidden overflow-hidden lg:block mountain-bg">
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 800 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path d="M0 400V250L100 180L200 230L300 100L400 200L500 60L600 150L700 80L800 170V400H0Z" fill="oklch(0.18 0.04 255 / 50%)" />
          <path d="M0 400V300L150 220L300 280L450 160L600 250L750 180L800 220V400H0Z" fill="oklch(0.15 0.035 260 / 60%)" />
          <path d="M0 400V350L200 290L400 330L600 280L800 310V400H0Z" fill="oklch(0.12 0.03 265 / 70%)" />
        </svg>
        {/* Stars */}
        <div className="absolute top-[8%] left-[20%] size-1 rounded-full bg-white/40 animate-pulse" />
        <div className="absolute top-[12%] left-[50%] size-1.5 rounded-full bg-white/30 animate-pulse [animation-delay:1s]" />
        <div className="absolute top-[6%] left-[80%] size-1 rounded-full bg-white/35 animate-pulse [animation-delay:0.5s]" />
        <div className="absolute top-[18%] left-[35%] size-0.5 rounded-full bg-white/25 animate-pulse [animation-delay:1.5s]" />
        {/* Tagline overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <div className="mountain-glass rounded-2xl p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold text-white mb-2">Reach New Heights</h2>
            <p className="text-white/70 text-sm leading-relaxed">Build stunning forms with Summit Forms. Collect responses, manage data, and scale your workflow — effortlessly.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
