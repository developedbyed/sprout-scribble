"use server"

import { createSafeActionClient } from "next-safe-action"
import * as z from "zod"
import { db } from ".."
import { products } from "../schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()

export const deleteProduct = action(
  z.object({ id: z.number() }),
  async ({ id }) => {
    try {
      const data = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning()
      revalidatePath("/dashboard/products")
      return { success: `Product ${data[0].title} has been deleted` }
    } catch (error) {
      return { error: "Failed to delete product" }
    }
  }
)
