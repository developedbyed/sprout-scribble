"use client"

import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Suspense, useEffect, useState } from "react"
import { LogOut, Moon, Settings, Sun, Truck, TruckIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "../ui/switch"
import Link from "next/link"
import { useRouter } from "next/navigation"

export const UserButton = ({ user }: Session) => {
  const { setTheme, theme } = useTheme()
  const [checked, setChecked] = useState(false)
  const router = useRouter()

  function setSwitchState() {
    switch (theme) {
      case "dark":
        return setChecked(true)
      case "light":
        return setChecked(false)
      case "system":
        return setChecked(false)
    }
  }

  useEffect(() => {
    setSwitchState()
  }, [])

  if (user)
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Avatar className="w-7 h-7">
            {user.image && (
              <Image src={user.image} alt={user.name!} fill={true} />
            )}
            {!user.image && (
              <AvatarFallback className="bg-primary/25">
                <div className="font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-6" align="end">
          <div className="mb-4 p-4 flex flex-col gap-1 items-center rounded-lg  bg-primary/10">
            {user.image && (
              <Image
                src={user.image}
                alt={user.name!}
                className="rounded-full"
                width={36}
                height={36}
              />
            )}
            <p className="font-bold text-xs">{user.name}</p>
            <span className="text-xs font-medium text-secondary-foreground">
              {user.email}
            </span>
          </div>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => router.push("/dashboard/orders")}
            className="group py-2 font-medium cursor-pointer "
          >
            <TruckIcon
              size={14}
              className="mr-3 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
            />{" "}
            My orders
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/settings")}
            className="group py-2 font-medium cursor-pointer  ease-in-out "
          >
            <Settings
              size={14}
              className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out"
            />
            Settings
          </DropdownMenuItem>
          {theme && (
            <DropdownMenuItem className="py-2 font-medium cursor-pointer  ease-in-out">
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center group "
              >
                <div className="relative flex mr-3">
                  <Sun
                    className="group-hover:text-yellow-600  absolute group-hover:rotate-180  dark:scale-0 dark:-rotate-90 transition-all duration-750 ease-in-out"
                    size={14}
                  />
                  <Moon
                    className="group-hover:text-blue-400  scale-0 rotate-90 dark:rotate-0  dark:scale-100 transition-all ease-in-out duration-750"
                    size={14}
                  />
                </div>
                <p className="dark:text-blue-400 mr-3 text-secondary-foreground/75   text-yellow-600">
                  {theme[0].toUpperCase() + theme.slice(1)} Mode
                </p>
                <Switch
                  className="scale-75 "
                  checked={checked}
                  onCheckedChange={(e) => {
                    setChecked((prev) => !prev)
                    if (e) setTheme("dark")
                    if (!e) setTheme("light")
                  }}
                />
              </div>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => signOut()}
            className="py-2 group focus:bg-destructive/30 font-medium cursor-pointer "
          >
            <LogOut
              size={14}
              className="mr-3  group-hover:scale-75 transition-all duration-300 ease-in-out"
            />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
}
