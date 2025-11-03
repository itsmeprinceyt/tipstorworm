"use client";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { InstagramLink, quickLinks } from "../../../utils/Website/Footer.util";
import FooterWrapper from "../FooterWrapper";

export default function Footer() {
  return (
    <FooterWrapper>
      <footer className="p-6 py-12 relative overflow-hidden select-text">
        <div className="relative max-w-7xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
            {/* Brand & Description */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-bold text-white">Tipstor Worm</h1>
              </div>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                Discover amazing tips, tricks, applications, websites, and cool
                digital resources. Your ultimate bookmark collection for
                productivity hacks, tools, and innovative solutions.
              </p>

              {/* Social Media */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 text-gray-300">
                  Social Media
                </h3>
                <div className="flex gap-3">
                  <Link
                    href={InstagramLink}
                    className="bg-stone-700/50 p-2 rounded-lg hover:bg-pink-500/20 border border-stone-600 hover:border-pink-500/30 transition-all duration-300 flex items-center justify-center"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram
                      size={18}
                      className="text-gray-400 hover:text-pink-400"
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-lg font-semibold mb-5 pb-2 border-b border-stone-700 inline-block text-white">
                Quick Links
              </h2>
              <ul className="space-y-3">
                {quickLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.path}
                      className="text-gray-400 hover:text-white transition-all duration-300 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-emerald-500 rounded-full mr-3 group-hover:mr-4 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright section */}
          <div className="border-t border-stone-700 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Tipstor Worm | All rights
                reserved.
              </p>
              <div className="flex flex-wrap gap-5 text-sm text-gray-400 justify-center">
                <Link
                  href="/privacy-policy"
                  className="hover:text-white transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-white transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </FooterWrapper>
  );
}
