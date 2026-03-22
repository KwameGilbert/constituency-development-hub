"use client";
import { Menu } from "lucide-react";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../public/logo.png";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Announcements", href: "/announcements" },
  { label: "Youth", href: "/youth" },
  { label: "Ideas", href: "/ideas" },
  { label: "Media Center", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isLinkActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-red-700 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={Logo}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <div className="font-semibold text-sm sm:text-lg leading-tight">
            Hon. Kofi Benteh Afful
            <span className="block text-white/70 text-xs">
              Office of the MP · Sefwi Wiawso
            </span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded px-3 py-2 transition-colors ${
                  isActive
                    ? "bg-amber-400 text-red-900 font-bold"
                    : "hover:bg-red-600 text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          aria-label="Toggle navigation"
          className="md:hidden rounded-lg border border-white/30 p-2"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-red-600 bg-red-700"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = isLinkActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`block rounded px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-amber-400 text-red-900 font-bold"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default SiteHeader;
