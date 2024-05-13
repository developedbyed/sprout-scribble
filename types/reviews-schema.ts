import * as z from "zod"

export const reviewSchema = z.object({
  productID: z.number(),
  rating: z
    .number()
    .min(1, { message: "Please add at least one star" })
    .max(5, { message: "Please add no more than 5 stars" }),
  comment: z
    .string()
    .min(10, { message: "Please add at least 10 characters for this review" }),
})
