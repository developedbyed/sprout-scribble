import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table"
import { TotalOrders } from "@/lib/infer-type"
import Image from "next/image"
import placeholderUser from "@/public/placeholder-user.jpg"

export default function Sales({ totalOrders }: { totalOrders: TotalOrders[] }) {
  const sliced = totalOrders.slice(0, 8)
  return (
    <Card className="flex-1 shrink-0">
      <CardHeader>
        <CardTitle>New sales</CardTitle>
        <CardDescription>Here are your recent sales</CardDescription>
      </CardHeader>
      <CardContent className="h-96 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sliced.map(({ order, product, quantity, productVariants }) => (
              <TableRow className="font-medium " key={order.id}>
                <TableCell>
                  {order.user.image && order.user.name ? (
                    <div className="flex gap-2 w-32 items-center">
                      <Image
                        src={order.user.image}
                        width={25}
                        height={25}
                        alt={order.user.name}
                        className="rounded-full"
                      />
                      <p className="text-xs font-medium">{order.user.name}</p>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center justify-center">
                      <Image
                        src={placeholderUser}
                        width={25}
                        height={25}
                        alt="user not found"
                        className="rounded-full"
                      />
                      <p className="text-xs font-medium">User not found</p>
                    </div>
                  )}
                </TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{quantity}</TableCell>
                <TableCell>
                  <Image
                    src={productVariants.variantImages[0].url}
                    width={48}
                    height={48}
                    alt={product.title}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
