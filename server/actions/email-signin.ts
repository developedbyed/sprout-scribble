"use server"
import { LoginSchema } from "@/types/login-schema"
import { createSafeActionClient } from "next-safe-action"
import { db } from ".."
import { eq } from "drizzle-orm"
import { users } from "../schema"
import { generateEmailVerificationToken } from "./tokens"
import { sendVerificationEmail } from "./email"
import { signIn } from "../auth"
import { AuthError } from "next-auth"

const action = createSafeActionClient()

export const emailSignIn = action(
  LoginSchema,
  async ({ email, password, code }) => {
    try {
      //Check if the user is in the database
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      })

      if (existingUser?.email !== email) {
        return { error: "Email not  found" }
      }

      //If the user is not verified
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        )
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        )
        return { success: "Confirmation Email Sent!" }
      }

      //2FA TODO

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      })

      return { success: "User Signed In!" }
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Email or Password Incorrect" }
          case "AccessDenied":
            return { error: error.message }
          case "OAuthSignInError":
            return { error: error.message }
          default:
            return { error: "Something went wrong" }
        }
      }
      throw error
    }
  }
)
