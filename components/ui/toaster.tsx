"use client"

import { Toaster as Toasty } from "sonner"
import { useTheme } from "next-themes"

export default function Toaster() {
  const { theme } = useTheme()
  if (typeof theme === "string") {
    return (
      <Toasty
        richColors
        theme={theme as "light" | "dark" | "system" | undefined}
      />
    )
  }
}
