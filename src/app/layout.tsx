import type { Metadata } from "next";
import "./globals.css";

import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tipstor Worm | ItsMe Prince",
  description: "All my bookmarks in one place for everyone to see & learn from",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`select-none antialiased`}
      >
        <Suspense fallback={<div>Loading ...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
