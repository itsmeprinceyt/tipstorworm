import './globals.css'
import Link from 'next/link';
import connectDB from ".//(models)/connectDB.js";

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center">
      <div className="flex flex-col items-center justify-center font-semibold p-8">
        <p>Welcome to</p>
        <h1 className="text-5xl pb-3 font-bold drop-shadow-xl">Tipstor Worm</h1>
        <p >Curated Web Gems and App Finds</p>
      </div>

      <div className="p-2 font-semibold grid grid-cols-1 gap-3 place-items-center sm:grid-cols-5 ml-auto mr-auto">
        <Link href="/websites">
          <button className="text-yellow-950 bg-yellow-400 hover:bg-black hover:text-yellow-400 py-2 px-4 rounded w-[130px] shadow-blackcustom hover:shadow-yellowcustom">Websites</button>
        </Link>
        <Link href="/applications">
          <button className="text-yellow-950 bg-yellow-400 hover:bg-black hover:text-yellow-400 py-2 px-4 rounded w-[130px] shadow-blackcustom hover:shadow-yellowcustom">Applications</button>
        </Link>
        <Link href="/tips-tricks">
          <button className="text-yellow-950 bg-yellow-400 hover:bg-black hover:text-yellow-400 py-2 px-4 rounded w-[130px] shadow-blackcustom hover:shadow-yellowcustom">Tips & Tricks</button>
        </Link>
        <Link href="/extras">
          <button className="text-yellow-950 bg-yellow-400 hover:bg-black hover:text-yellow-400 py-2 px-4 rounded w-[130px] shadow-blackcustom hover:shadow-yellowcustom">Extras</button>
        </Link>

        <Link href='/adding/new'>
          <button className="text-green-950 bg-green-500 hover:bg-black hover:text-green-400 py-2 px-4 rounded shadow-blackcustom hover:shadow-greencustom">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </Link>
      </div>

      <footer className="fixed bottom-2 left-1/2 transform -translate-x-1/2 ">
        <p className="text-red-950 ">Made by @itsmeprinceyt </p>
      </footer>
    </div>
  );
}
connectDB();