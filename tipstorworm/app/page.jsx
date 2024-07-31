import './globals.css'

export default function Home() {
  return (
    <div className="bg-slate-600">
      <main >
        <div className="bg-pink-500 flex-col ">
          <p>Welcome to</p>
          <h1 className="text-3xl">Tipstor Worm</h1>
          <p>Curated Web Gems and App Finds</p>
        </div>
        <div>
          <button className="bg-red-400">Websites</button>
          <button>Apps</button>
          <button>Tips & Tricks</button>
          <button>Other</button>
        </div>
      </main>
      <footer>
        <p>Made by @itsmeprinceyt</p>
      </footer>
    </div>
  );
}
