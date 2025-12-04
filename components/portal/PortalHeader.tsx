import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

export function PortalHeader() {
    return (
        <header className="w-full py-6 px-8 flex justify-between items-center bg-white border-b border-slate-100">
            <div className="flex items-center gap-4">
                {/* Placeholder for Coat of Arms */}
                <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-400">GH</span>
                </div>
                <div>
                    <h1 className="text-lg font-bold text-[#1e1b4b]">Kofi Afful Benteh</h1>
                    <p className="text-sm text-muted-foreground">Member of Parliament</p>
                </div>
            </div>
            <Link
                href="/"
                className="flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
                Return to Website
                <ExternalLink className="h-4 w-4" />
            </Link>
        </header>
    );
}
