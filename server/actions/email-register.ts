"use server"
import { RegisterSchema } from "@/types/register-schema"
import { createSafeActionClient } from "next-safe-action"
import bcrpyt from "bcrypt"
import { db } from ".."
import { eq } from "drizzle-orm"
import { users } from "../schema"
import { generateEmailVerificationToken } from "./tokens"
import { sendVerificationEmail } from "./email"

const action = createSafeActionClient()

export const emailRegister = action(
  RegisterSchema,
  async ({ email, name, password }) => {
    //We are hasing our password
    const hashedPassword = await bcrpyt.hash(password, 10)

    //Check existing user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email)
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        )

        return { success: "Email Confirmation resent" }
      }
      return { error: "Email already in use" }
    }

    //Logic for when the user is not registered
    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    })

    const verificationToken = await generateEmailVerificationToken(email)

    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token
    )

    return { success: "Confirmation Email Sent!" }
  }
)
