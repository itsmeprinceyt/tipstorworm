import './globals.css'

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center ">
      <div className=" flex flex-col items-center justify-center font-semibold p-8">
          <p>Welcome to</p>
          <h1 className="text-5xl pb-3 font-bold drop-shadow-xl">Tipstor Worm</h1>
          <p>Curated Web Gems and App Finds</p>
        </div>
        <div className=" p-6 flex gap-3 justify-center font-semibold text-white">
        <button className="text-yellow-950 bg-yellow-400 hover:bg-black hover:text-yellow-400 py-2 px-4 rounded w-[130px] shadow-blackcustom hover:shadow-yellowcustom">Websites</button>
        <button className="text-yellow-950 bg-yellow-400 hover:bg-black hover:text-yellow-400 py-2 px-4 rounded w-[130px] shadow-blackcustom hover:shadow-yellowcustom">Application</button>
        <button className="text-yellow-950 bg-yellow-400 hover:bg-black hover:text-yellow-400 py-2 px-4 rounded w-[130px] shadow-blackcustom hover:shadow-yellowcustom">Tips & Tricks</button>
        <button className="text-yellow-950 bg-yellow-400 hover:bg-black hover:text-yellow-400 py-2 px-4 rounded w-[130px] shadow-blackcustom hover:shadow-yellowcustom">Extras</button>
        </div>
        <footer className="fixed bottom-1 left-1/2 transform -translate-x-1/2">
        <p className="text-black ">Made by @itsmeprinceyt</p>
      </footer>
    </div>
  );
}
