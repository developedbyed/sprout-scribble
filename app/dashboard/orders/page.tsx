import { db } from "@/server"
import { auth } from "@/server/auth"
import { orders } from "@/server/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatDistance, subMinutes } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function Page() {
  const user = await auth()
  if (!user) {
    redirect("/login")
  }
  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userID, user.user.id),
    with: {
      orderProduct: {
        with: {
          product: true,
          productVariants: { with: { variantImages: true } },
          order: true,
        },
      },
    },
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
        <CardDescription>Check the status of your orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>${order.total}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      order.status === "succeeded"
                        ? "bg-green-700 hover:bg-green-800"
                        : "bg-yellow-700 hover:bg-yellow-800"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs font-medium">
                  {formatDistance(subMinutes(order.created!, 0), new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"}>
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <DialogTrigger>
                            <Button className="w-full" variant={"ghost"}>
                              View Details
                            </Button>
                          </DialogTrigger>
                        </DropdownMenuItem>
                        {order.receiptURL ? (
                          <DropdownMenuItem>
                            <Button
                              asChild
                              className="w-full"
                              variant={"ghost"}
                            >
                              <Link href={order.receiptURL} target="_blank">
                                Download Receipt
                              </Link>
                            </Button>
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="rounded-md">
                      <DialogHeader>
                        <DialogTitle>Order Details #{order.id}</DialogTitle>
                        <DialogDescription>
                          Your order total is ${order.total}
                        </DialogDescription>
                      </DialogHeader>
                      <Card className="overflow-auto p-2 flex flex-col gap-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Image</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Product</TableHead>
                              <TableHead>Color</TableHead>
                              <TableHead>Quantity</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.orderProduct.map(
                              ({ product, productVariants, quantity }) => (
                                <TableRow key={product.id}>
                                  <TableCell>
                                    <Image
                                      src={productVariants.variantImages[0].url}
                                      width={48}
                                      height={48}
                                      alt={product.title}
                                    />
                                  </TableCell>
                                  <TableCell>${product.price}</TableCell>
                                  <TableCell>{product.title}</TableCell>
                                  <TableCell>
                                    <div
                                      style={{
                                        background: productVariants.color,
                                      }}
                                      className="w-4 h-4 rounded-full"
                                    ></div>
                                  </TableCell>
                                  <TableCell>{quantity}</TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </Card>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
