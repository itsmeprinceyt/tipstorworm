"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../assets/Logo.png";

export default function LogoLink() {
  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <Link href="/" className="flex items-center space-x-2 text-white relative">
      {/* Shimmer placeholder */}
      {!loaded && (
        <div className="w-[50px] h-[50px] rounded-full bg-white/10 animate-shimmer" />
      )}

      {/* Actual image */}
      <Image
        src={Logo}
        width={50}
        height={50}
        alt="Logo"
        className={`hover:scale-105 transition-all duration-1000 ease-in-out ${
          loaded ? "opacity-100" : "opacity-0 absolute"
        }`}
        onLoadingComplete={() => setLoaded(true)}
      />
    </Link>
  );
}
