"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { PUBLIC_HEADER_NAVS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const Header = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  return (
    <header className="min-w-screen z-50 h-12 fixed shadow-md">
      {/* Desktop Header */}
      <div
        className={cn(
          " items-center justify-between gap-4",
          isMobile ? "hidden" : "flex px-8 h-12 py-2 bg-red-600"
        )}
      >
        <div className="text-white font-semibold text-lg">
          Kofi Benteh Afful - The Office of the MP
        </div>
        <nav className="flex gap-6 items-center text-white">
          {PUBLIC_HEADER_NAVS.map((nav) => (
            <Link key={nav.name} href={nav.href}>
              {nav.name}
            </Link>
          ))}
        </nav>
      </div>
      {/* mobile screen */}
      <div
        className={cn(
          "relative items-center justify-between",
          isMobile ? "flex px-8 h-12 py-2 bg-red-600" : "hidden"
        )}
      >
        <div className="font-bold text-2xl">Logo here</div>
        <div className="ml-auto w-fit">
          {!open ? (
            <MenuIcon
              onClick={() => setOpen(true)}
              className="size-6 text-white font-semibold cursor-pointer"
            />
          ) : (
            <X
              onClick={() => setOpen(false)}
              className="size-6 text-white font-semibold cursor-pointer"
            />
          )}
        </div>
      </div>
    </header>
  );
};
