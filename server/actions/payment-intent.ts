"use server"

import Stripe from "stripe"
import { auth } from "@/server/auth"
import { createSafeActionClient } from "next-safe-action"
import { paymentIntentSchema } from "@/types/payment-intent-schema"

const stripe = new Stripe(process.env.STRIPE_SECRET!)
const action = createSafeActionClient()

export const createPaymentIntent = action(
  paymentIntentSchema,
  async ({ amount, cart, currency }) => {
    const user = await auth()
    if (!user) return { error: "Please log in" }
    if (!amount) return { error: "No product to checkout" }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: {
        cart: JSON.stringify(cart),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })
    return {
      success: {
        paymentIntentID: paymentIntent.id,
        clientSecretID: paymentIntent.client_secret,
        user: user.user.email,
      },
    }
  }
)
