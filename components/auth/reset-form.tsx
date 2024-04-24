"use client"

import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthCard } from "./auth-card"
import * as z from "zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Link from "next/link"
import { useAction } from "next-safe-action/hooks"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { FormSuccess } from "./form-success"
import { FormError } from "./form-error"
import { NewPasswordSchema } from "@/types/new-password-schema"
import { newPassword } from "@/server/actions/new-password"
import { ResetSchema } from "@/types/reset-schema"
import { reset } from "@/server/actions/password-reset"

export default function ResetForm() {
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { execute, status } = useAction(reset, {
    onSuccess(data) {
      if (data?.error) setError(data.error)
      if (data?.success) {
        setSuccess(data.success)
      }
    },
  })

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    execute(values)
  }

  return (
    <AuthCard
      cardTitle="Forgot your password? "
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      showSocials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="developedbyed@gmail.com"
                        type="email"
                        disabled={status === "executing"}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button size={"sm"} variant={"link"} asChild>
                <Link href="/auth/reset">Forgot your password</Link>
              </Button>
            </div>
            <Button
              type="submit"
              className={cn(
                "w-full",
                status === "executing" ? "animate-pulse" : ""
              )}
            >
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  )
}
