import { revalidatePath } from "next/cache"
import Image from "next/image"

export default async function Home() {
  return (
    <main>
      {Date.now()}
      <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
    </main>
  )
}
