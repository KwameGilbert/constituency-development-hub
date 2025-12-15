"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Bell, LogIn, AlertCircle } from "lucide-react";

interface ActivityItem {
  id: number;
  user: string;
  role: string;
  action: string;
  date: string;
  time: string;
  type: 'auth' | 'system' | 'alert';
}

export function AdminRecentActivity() {
  const activities: ActivityItem[] = [
    {
      id: 1,
      user: "Admin.Rock",
      role: "MP",
      action: "Administrator session ID regenerated for security",
      date: "Dec 10",
      time: "16:35",
      type: 'alert'
    },
    {
      id: 2,
      user: "Admin.Rock",
      role: "MP",
      action: "Administrator (mp) logged into admin dashboard",
      date: "Dec 10",
      time: "16:35",
      type: 'auth'
    },
    {
      id: 3,
      user: "System",
      role: "",
      action: "Admin login attempt with unrecognized device",
      date: "Dec 10",
      time: "16:34",
      type: 'auth' // Using auth icon for login attempt
    },
    {
      id: 4,
      user: "Admin.Rock",
      role: "MP",
      action: "Administrator session ID regenerated",
      date: "Dec 09",
      time: "13:07",
      type: 'alert'
    },
    {
        id: 5,
        user: "Admin.Rock",
        role: "MP",
        action: "Administrator (mp) logged into admin dashboard",
        date: "Dec 09",
        time: "13:06",
        type: 'auth'
      },
  ];

  return (
    <Card className="w-full lg:w-[350px] shrink-0 flex flex-col h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto max-h-[400px] px-0">
         <div className="space-y-6 px-6 relative">
            {/* Vertical Line */}
            <div className="absolute left-[38px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

            {activities.map((activity) => (
                <div key={activity.id} className="relative flex items-start gap-4">
                    {/* Icon */}
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm ${
                        activity.type === 'alert' ? 'bg-red-50' : 'bg-red-50'
                    }`}>
                        {activity.type === 'alert' ? (
                            <Bell className="w-3.5 h-3.5 text-red-600" />
                        ) : (
                            <LogIn className="w-3.5 h-3.5 text-red-600" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-semibold text-gray-900">{activity.user}</span>
                            {activity.role && (
                                <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase">{activity.role}</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-600 leading-snug mb-1">
                            {activity.action}
                        </p>
                        <p className="text-[10px] text-gray-400">
                            {activity.date}, {activity.time}
                        </p>
                    </div>
                </div>
            ))}
         </div>
      </CardContent>
      <CardFooter className="pt-4 border-t bg-gray-50/50">
        <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
            View Audit Logs →
        </a>
      </CardFooter>
    </Card>
  );
}
