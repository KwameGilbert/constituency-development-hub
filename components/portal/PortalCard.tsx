import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn, cleanupHtml } from "@/lib/utils";

interface PortalCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  href: string;
  colorTheme: "blue" | "green" | "red" | "purple" | "orange";
}

export function PortalCard({
  title,
  description,
  icon: Icon,
  buttonText,
  href,
  colorTheme,
}: PortalCardProps) {
  const themeStyles = {
    blue: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    green: {
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      button: "bg-green-600 hover:bg-green-700",
    },
    red: {
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
    },
    purple: {
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      button: "bg-purple-600 hover:bg-purple-700",
    },
    orange: {
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      button: "bg-orange-600 hover:bg-orange-700",
    },
  };

  const theme = themeStyles[colorTheme];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-6 hover:shadow-md transition-shadow">
      <div className={cn("p-4 rounded-full", theme.iconBg, theme.iconColor)}>
        <Icon className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h3
          className={cn(
            "text-xl font-bold",
            theme.iconColor.replace("text-", "text-opacity-90 text-"),
          )}
        >
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[250px] mx-auto">
          {cleanupHtml(description || "")}
        </p>
      </div>
      <Link href={href} className="w-full cursor-pointer">
        <Button
          className={cn("w-full cursor-pointer font-semibold", theme.button)}
        >
          {buttonText}
        </Button>
      </Link>
    </div>
  );
}
