"use client"

import getStripe from "@/lib/get-stripe"
import { Elements } from "@stripe/react-stripe-js"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import CheckoutForm from "./checkout-form"
import { useCartStore } from "@/lib/client-store"

const stripe = getStripe()

export default function Payment() {
  const { theme } = useTheme()
  const { cart } = useCartStore()

  const totalPrice = cart.reduce((acc, item) => {
    return acc + item.price * item.variant.quantity
  }, 0)
  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Elements
          stripe={stripe}
          options={{
            mode: "payment",
            currency: "usd",
            amount: totalPrice,
            appearance: {
              theme: theme === "dark" ? "night" : "stripe",
            },
          }}
        >
          <CheckoutForm />
        </Elements>
      </motion.div>
    </div>
  )
}
