import './globals.css'
import Link from 'next/link';

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center ">
      <header>
        <button className="py-3 px-3 shadow-md rounded-3xl absolute right-2 top-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
</svg>

        </button>
      </header>
      <div className="flex flex-col items-center justify-center font-semibold p-8">
          <p>Welcome to</p>
          <h1 className="text-5xl pb-3 font-bold drop-shadow-xl">Tipstor Worm</h1>
          <p >Curated Web Gems and App Finds</p>
        </div>
        <div className="p-2 flex gap-3 justify-center font-semibold text-white">
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
        
        <Link href="/addingdata">
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
