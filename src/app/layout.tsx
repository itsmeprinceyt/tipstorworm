import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "./(components)/Providers/AuthProvider";
import { Suspense } from "react";
import Navbar from "./(components)/Navbar";

export const metadata: Metadata = {
  title: "Tipstor Worm | ItsMe Prince",
  description: "All my bookmarks in one place for everyone to see & learn from",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* TODO: change this */}
      <body className="select-text antialiased">
        <Providers>
          <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
          <Navbar/>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
