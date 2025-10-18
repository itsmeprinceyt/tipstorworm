import type { Metadata } from "next";
import "./globals.css";

import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Analytics } from '@vercel/analytics/next';

import { Providers } from "./(components)/Providers/AuthProvider";

import Navbar from "./(components)/Navbar";

export const metadata: Metadata = {
  title: "Tipstor Worm | ItsMe Prince",
  description: "All my bookmarks in one place for everyone to see & learn from",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="select-none antialiased">
        <Providers>
          <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
            <Navbar />
            {children}
            <Analytics/>
            <Toaster
              position="bottom-left"
              toastOptions={{ style: { fontSize: "14px" } }}
            />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
