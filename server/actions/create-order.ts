"use client"

import { createOrderSchema } from "@/types/order-schema"
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth"
import { db } from ".."
import { orderProduct, orders } from "../schema"

const action = createSafeActionClient()

export const createOrder = action(
  createOrderSchema,
  async ({ products, status, total }) => {
    const user = await auth()
    if (!user) return { error: "user not found" }

    const order = await db
      .insert(orders)
      .values({
        status,
        total,
        userID: user.user.id,
      })
      .returning()
    const orderProducts = products.map(
      async ({ productID, quantity, variantID }) => {
        const newOrderProduct = await db.insert(orderProduct).values({
          quantity,
          orderID: order[0].id,
          productID: productID,
          productVariantID: variantID,
        })
      }
    )
    return { success: "Order has been added" }
  }
)
