import * as React from "react"
import { cn } from "~/lib/utils"

interface SummitMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

/**
 * Summit Forms brand mark — a stylised, geometric "S" formed by two
 * intersecting peaks. Replaces the literal mountain silhouettes with a
 * single, minimal monogram that scales cleanly from 16px to 80px.
 */
export function SummitMark({ size = 20, className, ...props }: SummitMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <linearGradient id="summit-mark-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#summit-mark-gradient)" />
      <path
        d="M5.5 17 10 9.5l2.6 4.3L15.4 9 18.5 17H5.5Z"
        fill="white"
        fillOpacity="0.95"
      />
      <circle cx="10" cy="8" r="1.1" fill="white" fillOpacity="0.95" />
    </svg>
  )
}

interface BrandLockupProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg"
}

export function BrandLockup({ size = "md", className, ...props }: BrandLockupProps) {
  const dim = size === "sm" ? 22 : size === "lg" ? 32 : 26
  const text = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"
  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground", className)} {...props}>
      <span className="text-primary">
        <SummitMark size={dim} />
      </span>
      <span className={cn("font-semibold tracking-tight", text)}>Summit Forms</span>
    </span>
  )
}
