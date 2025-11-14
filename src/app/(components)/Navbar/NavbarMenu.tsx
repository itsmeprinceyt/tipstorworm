"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { NavbarMenuProps } from "../../../types/Navbar.type";
import LogoutSVG from "../Components/SVG/Logout";

export default function NavbarMenu({ isOpen, onClose }: NavbarMenuProps) {
  const { data: session } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const publicMenuItems = [{ href: "/", label: "Home" }];

  const authenticatedMenuItems = [
    {
      href: session?.user.is_admin
        ? "/admin"
        : `/profile/${session?.user.username}`,
      label: "Dashboard",
    },
  ];

  const menuItems = session
    ? [...publicMenuItems, ...authenticatedMenuItems]
    : publicMenuItems;

  if (!isOpen) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute right-12 top-15 z-50 w-64 bg-black/90 backdrop-blur-md border border-stone-800 rounded-lg shadow-lg"
    >
      <div className="p-4 space-y-4">
        {/* User Info - Only show when logged in */}
        {session && (
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-stone-800/30">
            {session.user?.image ? (
              <div
                className={`relative w-10 h-10 rounded-full overflow-hidden border-1 shadow-md/20 ${
                  session.user.is_admin
                    ? "border-amber-600 shadow-amber-500"
                    : session.user.is_mod
                    ? "border-green-600 shadow-green-500"
                    : session.user.is_banned
                    ? "border-red-600 shadow-red-500"
                    : "border-blue-600 shadow-blue-500"
                }`}
              >
                <Image src={session.user.image} fill alt="Profile" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center border border-stone-600">
                <span className="text-white text-sm font-medium">
                  {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {session.user?.name}
                {session.user.is_admin && (
                  <span className="text-amber-600 text-[10px] font-semibold ml-1">
                    • Admin
                  </span>
                )}
                {session.user.is_mod && !session.user.is_admin && (
                  <span className="text-green-600 text-[10px] font-semibold ml-1">
                    • Mod
                  </span>
                )}
                {session.user.is_banned && (
                  <span className="text-red-600 text-[10px] font-semibold ml-1">
                    • Banned
                  </span>
                )}
              </p>
              <p className="text-white/60 text-xs truncate">
                @{session.user.username}
              </p>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <motion.div
              key={item.href}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className="block p-3 rounded-lg text-white/80 hover:text-white hover:bg-stone-800/30 transition-all duration-300"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Auth Section */}
        <div className="pt-2 border-t border-stone-800">
          {session ? (
            <motion.button
              onClick={() => {
                handleLogout();
                onClose();
              }}
              disabled={isLoggingOut}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-3 rounded-lg text-white/80 hover:text-white hover:bg-stone-800/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isLoggingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogoutSVG />
                  <span>Logout</span>
                </>
              )}
            </motion.button>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/login"
                onClick={onClose}
                className="block p-3 rounded-lg text-white/80 hover:text-white hover:bg-stone-800/30 transition-all duration-300 text-center cursor-pointer"
              >
                Login
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
