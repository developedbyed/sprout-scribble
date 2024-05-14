"use client"

import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableHeader,
} from "@/components/ui/table"
import { useCartStore } from "@/lib/client-store"
import { useMemo } from "react"
import formatPrice from "@/lib/format-price"
import Image from "next/image"
import { MinusCircle, PlusCircle } from "lucide-react"

export default function CartItems() {
  const { cart, addToCart, removeFromCart } = useCartStore()

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price! * item.variant.quantity
    }, 0)
  }, [cart])

  return (
    <div>
      {cart.length === 0 && (
        <div>
          <h1>Cart is empty</h1>
        </div>
      )}
      {cart.length > 0 && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{formatPrice(item.price)}</TableCell>
                  <TableCell>
                    <div>
                      <Image
                        className="rounded-md"
                        width={48}
                        height={48}
                        src={item.image}
                        alt={item.name}
                        priority
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between ">
                      <MinusCircle
                        onClick={() => {
                          removeFromCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          })
                        }}
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        size={14}
                      />
                      <p className="text-md font-bold">
                        {item.variant.quantity}
                      </p>
                      <PlusCircle
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        onClick={() => {
                          addToCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          })
                        }}
                        size={14}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
