import { IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "~/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/8 *:data-[slot=card]:via-card *:data-[slot=card]:to-card *:data-[slot=card]:shadow-sm *:data-[slot=card]:border-border/60 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:from-primary/5 dark:*:data-[slot=card]:to-card">
      <Card className="@container/card hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
        <CardHeader>
          <CardDescription>Total Forms</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            128
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-chart-2/30 text-chart-2">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Growing steadily <IconTrendingUp className="size-4 text-chart-2" />
          </div>
          <div className="text-muted-foreground">
            Forms created in the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
        <CardHeader>
          <CardDescription>Total Submissions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            3,456
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-chart-1/30 text-chart-1">
              <IconTrendingUp />
              +8.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Responses climbing <IconTrendingUp className="size-4 text-chart-1" />
          </div>
          <div className="text-muted-foreground">
            Submissions across all forms
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
        <CardHeader>
          <CardDescription>Active Forms</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            89
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-chart-3/30 text-chart-3">
              <IconTrendingUp />
              +5.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            High engagement <IconTrendingUp className="size-4 text-chart-3" />
          </div>
          <div className="text-muted-foreground">Currently accepting responses</div>
        </CardFooter>
      </Card>
      <Card className="@container/card hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
        <CardHeader>
          <CardDescription>Completion Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            92.4%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-chart-2/30 text-chart-2">
              <IconTrendingUp />
              +2.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Peak performance <IconTrendingUp className="size-4 text-chart-2" />
          </div>
          <div className="text-muted-foreground">Exceeding benchmarks</div>
        </CardFooter>
      </Card>
    </div>
  )
}
