import React from "react";
import Link from "next/link";

export function PortalFooter() {
    return (
        <footer className="w-full py-8 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
                Need help? Contact the system administrator at{" "}
                <Link href="mailto:admin@sefwiwiawso.gov.gh" className="text-orange-500 hover:underline">
                    admin@sefwiwiawso.gov.gh
                </Link>
            </p>
            <div className="flex flex-col items-center gap-1 text-xs text-slate-400">
                <p>&copy; 2025 Hon. Kofi Afful Benteh. All rights reserved.</p>
                <p>Version 1.0</p>
            </div>
        </footer>
    );
}
