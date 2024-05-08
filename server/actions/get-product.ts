"use server"

import { eq } from "drizzle-orm"
import { db } from ".."
import { products } from "../schema"

export async function getProduct(id: number) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    })
    if (!product) throw new Error("Product not found")
    return { success: product }
  } catch (error) {
    return { error: "Failed to get product" }
  }
}
