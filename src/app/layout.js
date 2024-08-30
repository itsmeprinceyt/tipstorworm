import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tipstor Worm - Organize and Store Interesting Websites",
  description:
    "Tipstor Worm helps you store, organize, and easily access interesting websites, useful mobile apps, and various tips and tricks you come across on the internet.",
    /*icons: {
      icon: ""
    }*/
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
