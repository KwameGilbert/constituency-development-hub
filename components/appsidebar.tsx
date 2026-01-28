"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, User, Settings } from "lucide-react";
import { useMemo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { authService } from "@/lib/services/auth-service";

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
  const router = useRouter();

  const { userName, userEmail } = useMemo(() => {
    const user = authService.getCurrentUser();
    return {
      userName: user?.name || user?.email?.split("@")[0] || "User",
      userEmail: user?.email || "user@example.com",
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Task Force Portal
        </h2>
        <p className="text-sm text-gray-600">Assessment Dashboard</p>
      </div>
      <div className="flex-1 py-4">
        <div className="px-4">
          <p className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Navigation
          </p>
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
                      : "text-gray-700 hover:bg-gray-100",
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
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
          <Link
            href="/task-force-dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm text-red-700 hover:bg-red-50 w-full text-left">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to log out? You will need to sign in
                  again to access your dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="pt-2 px-3 text-xs text-gray-500 border-t border-gray-100">
          <p className="font-medium">{userName}</p>
          <p className="truncate">{userEmail}</p>
        </div>
      </div>
    </div>
  );
}
