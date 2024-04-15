import createPost from "@/server/actions/create-post"
import getPosts from "@/server/actions/get-posts"
import Image from "next/image"

export default async function Home() {
  const { error, success } = await getPosts()
  if (error) {
    throw new Error(error)
  }
  if (success)
    return (
      <main>
        {Date.now()}
        {success.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
          </div>
        ))}
        <form action={createPost}>
          <input
            className="bg-black"
            type="text"
            name="title"
            placeholder="Title"
          />
          <button type="submit">Submit</button>
        </form>
        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
      </main>
    )
}
