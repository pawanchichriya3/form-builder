import { ArrowUpRightIcon, ArrowDownRightIcon, FileTextIcon, InboxIcon, ActivityIcon, GaugeIcon } from "lucide-react"
import { cn } from "~/lib/utils"

type Stat = {
  label: string
  value: string
  delta: number
  hint: string
  icon: React.ComponentType<{ className?: string }>
  spark: number[]
}

const stats: Stat[] = [
  {
    label: "Total forms",
    value: "128",
    delta: 12.5,
    hint: "vs. last month",
    icon: FileTextIcon,
    spark: [12, 18, 14, 22, 28, 26, 34, 38, 42],
  },
  {
    label: "Submissions",
    value: "3,456",
    delta: 8.2,
    hint: "last 30 days",
    icon: InboxIcon,
    spark: [80, 92, 88, 110, 134, 128, 156, 168, 182],
  },
  {
    label: "Active forms",
    value: "89",
    delta: 5.1,
    hint: "accepting responses",
    icon: ActivityIcon,
    spark: [40, 44, 48, 52, 58, 55, 62, 65, 70],
  },
  {
    label: "Completion rate",
    value: "92.4%",
    delta: 2.3,
    hint: "all forms",
    icon: GaugeIcon,
    spark: [86, 88, 87, 90, 91, 90, 92, 93, 92],
  },
]

function Spark({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 80
  const height = 28
  const step = width / (data.length - 1)
  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(" ")
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-7 w-20", positive ? "text-success" : "text-destructive")}
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 sm:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map((s) => {
        const positive = s.delta >= 0
        const Icon = s.icon
        return (
          <div
            key={s.label}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 elevate lift hover:border-border/80"
          >
            <div className="flex items-start justify-between">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <Icon className="size-4" />
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
                  positive
                    ? "bg-success/12 text-success"
                    : "bg-destructive/12 text-destructive",
                )}
              >
                {positive ? <ArrowUpRightIcon className="size-3" /> : <ArrowDownRightIcon className="size-3" />}
                {Math.abs(s.delta)}%
              </span>
            </div>

            <div className="mt-5">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="mt-1 flex items-end justify-between gap-2">
                <div className="text-2xl font-semibold tabular-nums tracking-tight">{s.value}</div>
                <Spark data={s.spark} positive={positive} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{s.hint}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
