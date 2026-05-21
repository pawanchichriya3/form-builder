import { LoginForm } from "~/components/login-form"

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden">
      {/* Mountain background */}
      <div className="absolute inset-0 mountain-bg">
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path d="M0 400V280L180 180L360 260L540 120L720 200L900 80L1080 160L1260 60L1440 180V400H0Z" fill="oklch(0.16 0.035 260 / 50%)" />
          <path d="M0 400V320L240 220L480 300L720 160L960 240L1200 140L1440 260V400H0Z" fill="oklch(0.14 0.03 260 / 60%)" />
          <path d="M0 400V360L300 280L600 340L900 260L1200 320L1440 300V400H0Z" fill="oklch(0.12 0.025 260 / 70%)" />
        </svg>
        {/* Stars */}
        <div className="absolute top-[10%] left-[15%] size-1 rounded-full bg-white/40 animate-pulse" />
        <div className="absolute top-[8%] left-[45%] size-1.5 rounded-full bg-white/30 animate-pulse [animation-delay:1s]" />
        <div className="absolute top-[15%] left-[75%] size-1 rounded-full bg-white/35 animate-pulse [animation-delay:0.5s]" />
        <div className="absolute top-[20%] left-[30%] size-0.5 rounded-full bg-white/25 animate-pulse [animation-delay:1.5s]" />
        <div className="absolute top-[5%] left-[60%] size-1 rounded-full bg-white/20 animate-pulse [animation-delay:2s]" />
        <div className="absolute top-[12%] left-[88%] size-0.5 rounded-full bg-white/30 animate-pulse [animation-delay:0.8s]" />
      </div>
      {/* Form card */}
      <div className="relative z-10 w-full max-w-sm p-6">
        <LoginForm />
      </div>
    </div>
  )
}
