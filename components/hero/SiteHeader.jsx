import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/", primary: true },
  { label: "Youth", href: "/youth" },
  { label: "Media Center", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const coatOfArmsSrc =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Coat_of_arms_of_Ghana.svg/256px-Coat_of_arms_of_Ghana.svg.png";

function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-red-700 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={coatOfArmsSrc} alt="" width={10} height={10} />
          <div className="font-semibold text-sm sm:text-lg leading-tight">
            Hon. Kofi Benteh Afful
            <span className="block text-white/70 text-xs">
              Office of the MP · Sefwi Wiawso
            </span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`rounded px-3 py-2 transition-colors ${
                link.primary
                  ? "bg-amber-400 text-red-900 hover:bg-amber-300"
                  : "hover:bg-red-600"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Toggle navigation"
          className="md:hidden rounded-lg border border-white/30 p-2"
          onClick={() => setOpen((prev) => !prev)}
        >
          <i className="fa-solid fa-bars"></i>
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
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block rounded bg-white/10 px-3 py-2 text-sm font-medium"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default SiteHeader;
