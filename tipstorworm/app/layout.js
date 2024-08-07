import NavBar from "@/app/(components)/nav";

export const metadata = {
  title: 'Tipstor Worm',
  description: 'Tipstor Worm is your ultimate destination for discovering hidden internet gems, cool websites, and useful mobile applications. Curated and shared with care, explore the best of the web and mobile app world, all in one place.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
          <NavBar/>
          {children}
        </div>
      </body>
    </html>
  )
}
