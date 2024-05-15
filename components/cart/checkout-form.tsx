"use client"

import { useState, useEffect } from "react"
import {
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { createPaymentIntent } from "@/server/actions/payment-intent"
import { useCartStore } from "@/lib/client-store"
import { useAction } from "next-safe-action/hooks"
import { Button } from "../ui/button"
import getBaseURL from "@/lib/base-url"

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { cart } = useCartStore()

  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const baseUrl = getBaseURL()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    if (!stripe || !elements) {
      setIsLoading(false)
      return
    }
    //Trigger form validation
    const { error: submitError } = await elements.submit()
    if (submitError) {
      setErrorMessage(submitError.message!)
      setIsLoading(false)
      return
    }

    const totalPrice = cart.reduce(
      (acc, item) => acc + item.price * item.variant.quantity,
      0
    )
    //Fetch the paymentIntent with the user
    const { data } = await createPaymentIntent({
      amount: totalPrice,
      cart: cart.map((item) => ({
        image: item.image,
        price: item.price,
        quantity: item.variant.quantity,
        productID: item.id,
        title: item.name,
      })),

      currency: "usd",
    })
    if (data?.error) {
      setErrorMessage(data.error)
      setIsLoading(false)
      return
    }
    if (data?.success) {
      //Handle success
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: data.success.clientSecretID!,
        redirect: "if_required",
        confirmParams: {
          return_url: "http://localhost:3000/confirmation",
          receipt_email: data.success.user as string,
        },
      })
      if (error) {
        setErrorMessage(error.message!)
        setIsLoading(false)
        return
      } else {
        //Handle success
        setIsLoading(false)
        console.log("confirmed")
      }
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <AddressElement
        options={{
          mode: "shipping",
        }}
      />
      <div>
        <Button
          disabled={!stripe || !elements || isLoading}
          className="max-w-md w-full disabled:opacity-25"
        >
          <span>
            {isLoading ? <span>Processing...</span> : <span>Pay now</span>}
          </span>
        </Button>
      </div>
    </form>
  )
}
