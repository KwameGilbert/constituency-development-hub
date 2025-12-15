"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Pencil, 
    ArrowLeft,
    UserCircle,
    ShieldAlert,
    Settings2,
    LogOut,
    Mail,
    Phone,
    Calendar,
    Clock,
    User,
    Key,
    UserCog,
    Inbox
} from "lucide-react";
import Link from "next/link";

import { use } from "react";

export default function OfficerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader 
        title="Officer Details" 
        description="View officer information and activity"
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
             { label: "Reset Password", icon: Key, href: "#" },
             { label: "Back to Officers", icon: ArrowLeft, href: "/admin-dashboard/officers" },
             { label: "Profile Settings", icon: UserCircle, href: "#" },
             { label: "Audit Logs", icon: ShieldAlert, href: "#" },
             { label: "System Settings", icon: Settings2, href: "#" },
             { label: "Logout", icon: LogOut, href: "#", className: "text-red-600 hover:text-red-700 hover:bg-red-50" },
        ]}
        actionButtons={[
            { label: "Edit Officer", href: `/admin-dashboard/officers/${id}/edit`, icon: Pencil, className: "bg-blue-600 hover:bg-blue-700 text-white" }
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto space-y-6">
            
            {/* Officer Profile Card */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Profile Header */}
                        <div className="flex-1">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                                    <User className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold text-gray-900">Officer.Rock</h2>
                                    <p className="text-gray-500">officer.rock@kofibenteh.com</p>
                                    <div className="flex gap-2 pt-1">
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">Active</Badge>
                                        <Badge variant="outline" className="text-gray-500 border-gray-200">Officer</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 pt-8 border-t border-gray-100">
                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Contact Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700">officer.rock@kofibenteh.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-400 italic">No phone number</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700">Joined Sep 28, 2025</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700">Last login Dec 08, 2025 13:35</span>
                                </div>
                            </div>
                        </div>

                        {/* Location Assignment */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Location Assignment</h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-500 italic">
                                    No location assigned
                                </div>
                            </div>
                        </div>

                         {/* Activity Statistics */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Activity Statistics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-indigo-50/50 rounded-lg">
                                    <div className="text-2xl font-bold text-indigo-600">0</div>
                                    <div className="text-xs text-gray-500">Total Issues</div>
                                </div>
                                <div className="text-center p-3 bg-green-50/50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">0</div>
                                    <div className="text-xs text-gray-500">Resolved</div>
                                </div>
                                <div className="text-center p-3 bg-yellow-50/50 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">0</div>
                                    <div className="text-xs text-gray-500">Pending</div>
                                </div>
                                <div className="text-center p-3 bg-blue-50/50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">0</div>
                                    <div className="text-xs text-gray-500">Last 30 Days</div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2">
                                <div className="flex flex-col items-center">
                                    <span className="text-xl font-bold text-purple-600">1</span>
                                    <span className="text-xs text-gray-500">Agents Managed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Issues Managed */}
             <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Recent Issues Managed</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <Inbox className="w-12 h-12 mb-3 text-gray-300" />
                        <p>No issues found for this officer</p>
                    </div>
                </CardContent>
             </Card>

        </div>
      </div>
    </div>
  );
}
