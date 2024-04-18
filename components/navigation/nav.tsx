import { auth } from "@/server/auth"
import { UserButton } from "./user-button"
import Link from "next/link"
import Logo from "@/components/navigation/logo"

export default async function Nav() {
  const session = await auth()
  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between">
          <li>
            <Link href={"/"}>
              <Logo />
            </Link>
          </li>
          <li>
            {!session ? (
              <button>
                <Link aria-label="sign-in" href={"/auth/login"}>
                  login
                </Link>
              </button>
            ) : (
              <UserButton expires={session?.expires} user={session?.user} />
            )}
          </li>
        </ul>
      </nav>
    </header>
  )
}
