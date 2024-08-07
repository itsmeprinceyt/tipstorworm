import Link from "next/link";

export default function Navbar() {

    return (
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 flex h-8 items-center justify-between px-2">
            <div className="w-8">
                <Link href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                </Link>
            </div>
            <div className="flex gap-5">
                <Link href="/websites">Websites
                </Link>
                <Link href="/applications">Applications
                </Link>
                <Link href="/tips-tricks">Tips & Tricks
                </Link>
                <Link href="/extras">Extras
                </Link>
            </div>
        </div>
    );
}