"use server"
import { RegisterSchema } from "@/types/register-schema"
import { createSafeActionClient } from "next-safe-action"
import bcrpyt from "bcrypt"
import { db } from ".."
import { eq } from "drizzle-orm"
import { users } from "../schema"

const action = createSafeActionClient()

export const emailRegister = action(
  RegisterSchema,
  async ({ email, name, password }) => {
    const hashedPassword = await bcrpyt.hash(password, 10)
    console.log(hashedPassword)
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existingUser) {
      // if(!existingUser.emailVerified){
      //     const verificationToken =
      // }
      return { error: "Email already in use" }
    }
  }
)
