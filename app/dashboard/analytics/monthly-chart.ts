import betweenWeeks from "./between-weeks"
import checkDate from "./check-date"

export const monthlyChart = (monthly: { date: Date; revenue: number }[]) => {
  return [
    {
      date: "4 weeks ago",
      revenue: monthly
        .filter((order) => betweenWeeks(order.date!, 28, 21))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "3 weeks ago",
      revenue: monthly
        .filter((order) => betweenWeeks(order.date!, 21, 14))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "2 weeks ago",
      revenue: monthly
        .filter((order) => betweenWeeks(order.date!, 14, 7))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "This week",
      revenue: monthly
        .filter((order) => betweenWeeks(order.date!, 7, 0))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
  ]
}
