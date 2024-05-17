import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card"
import { db } from "@/server"
import { orderProduct } from "@/server/schema"
import { desc } from "drizzle-orm"
import Sales from "./sales"
import Earnings from "./earnings"

export default async function Analytics() {
  const totalOrders = await db.query.orderProduct.findMany({
    with: {
      order: { with: { user: true } },
      product: true,
      productVariants: { with: { variantImages: true } },
    },
  })
  console.log(totalOrders.length)

  if (totalOrders.length === 0)
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Orders</CardTitle>
        </CardHeader>
      </Card>
    )

  if (totalOrders)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Analytics</CardTitle>
          <CardDescription>
            Check your sales, new customers and more
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row gap-8 ">
          <Sales totalOrders={totalOrders} />
          <Earnings totalOrders={totalOrders} />
        </CardContent>
      </Card>
    )
}
