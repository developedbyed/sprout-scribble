"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card"
import { TotalOrders } from "@/lib/infer-type"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { weeklyChart } from "./weekly-chart"
import { Bar, ResponsiveContainer, BarChart, Tooltip } from "recharts"
import { monthlyChart } from "./monthly-chart"

export default function Earnings({
  totalOrders,
}: {
  totalOrders: TotalOrders[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filter = searchParams.get("filter") || "week"

  const orderItems = totalOrders.map((order) => ({
    date: order.order.created!,
    revenue: order.order.total,
  }))

  const activeTotal = useMemo(() => {
    if (filter === "month") {
      return monthlyChart(orderItems).reduce(
        (acc, item) => acc + item.revenue,
        0
      )
    }
    return weeklyChart(orderItems).reduce((acc, item) => acc + item.revenue, 0)
  }, [filter])

  const activeChart = useMemo(() => {
    const weekly = weeklyChart(orderItems)
    if (filter === "week") {
      return weekly
    }
    if (filter === "month") {
      return monthlyChart(orderItems)
    }
  }, [filter])

  return (
    <Card className="flex-1 shrink-0 h-full">
      <CardHeader>
        <CardTitle>Your Revenue: ${Math.floor(activeTotal)}</CardTitle>
        <CardDescription>Here are your recent earnings</CardDescription>
        <div className="flex gap-2 py-2">
          <Badge
            onClick={() =>
              router.push("/dashboard/analytics/?filter=week", {
                scroll: false,
              })
            }
            className={cn(
              "cursor-pointer",
              filter === "week" ? "bg-primary" : "bg-primary/25"
            )}
          >
            This Week
          </Badge>
          <Badge
            onClick={() =>
              router.push("/dashboard/analytics/?filter=month", {
                scroll: false,
              })
            }
            className={cn(
              "cursor-pointer",
              filter === "month" ? "bg-primary" : "bg-primary/25"
            )}
          >
            This Month
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <BarChart data={activeChart}>
            <Tooltip
              content={(props) => (
                <div className="bg-primary py-2 px-4 rounded-md">
                  {props.payload?.map((item, index) => (
                    <div className="text-white">
                      <p>Revenue: ${item.value}</p>
                      <p>Revenue: ${item.payload.date}</p>
                    </div>
                  ))}
                </div>
              )}
            />
            <Bar dataKey="revenue" className="fill-primary" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
