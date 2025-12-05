"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

interface Props {
  navItems: NavItem[];
}

export function AppSidebar({ navItems }: Props) {
  const pathname = usePathname();

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Task Force Portal</h2>
        <p className="text-sm text-gray-600">Assessment Dashboard</p>
      </div>
      <div className="flex-1 py-4">
        <div className="px-4">
          <p className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Navigation</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                    isActive 
                      ? "bg-purple-100 text-purple-700 font-medium" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="px-4 py-4 border-t border-gray-100 space-y-2">
        <div className="space-y-1">
          <Link 
            href="/task-force-dashboard/profile" 
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm text-gray-700 hover:bg-gray-100"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile</span>
          </Link>
          <Link 
            href="/task-force-dashboard/settings" 
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm text-gray-700 hover:bg-gray-100"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </Link>
          <button 
            onClick={() => {
              // Clear any stored auth data
              if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                sessionStorage.clear();
              }
              // Redirect to login
              window.location.href = '/task-force-dashboard';
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm text-red-700 hover:bg-red-50 w-full text-left"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
        <div className="pt-2 text-xs text-gray-500">
          <p>Constituency Development Hub</p>
          <p>Task Force Assessment Portal</p>
        </div>
      </div>
    </div>
  );
}
