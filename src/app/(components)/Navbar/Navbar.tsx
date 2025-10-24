"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import SearchBar from "./NavbarSearchBar";
import NavbarMenu from "./NavbarMenu";
import LogoLink from "./NavbarLogo";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (
        <>
            <motion.nav
                className="p-4 flex justify-between items-center border-b border-stone-800 bg-black relative"
            >
                {/* Logo/Brand - Left */}
                <motion.div className="text-xl font-semibold flex-1">
                    <LogoLink />
                </motion.div>

                <SearchBar />

                {/* Hamburger Menu - Right */}
                <div className="flex-1 flex justify-end">
                    <motion.button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full hover:bg-stone-800/50 transition-all duration-300 cursor-pointer"
                    >
                        <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                            <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                            <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                        </div>
                    </motion.button>
                </div>
            </motion.nav>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <NavbarMenu
                        isOpen={isMenuOpen}
                        onClose={() => setIsMenuOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}