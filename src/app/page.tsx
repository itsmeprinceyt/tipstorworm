import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>Home</div>
      <Link href="/login" className="bg-sky-500 px-4 py-2 rounded-full text-white m-5 p-5">Login</Link>
    </>
  )
}