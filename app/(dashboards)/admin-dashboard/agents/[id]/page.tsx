"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Pencil, 
    UserCircle,
    ShieldAlert,
    Settings2,
    LogOut,
    Mail,
    Phone,
    Calendar,
    Clock,
    User,
    Eye
} from "lucide-react";
import { use } from "react";

export default function AgentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader 
        title="Agent Details" 
        description="View agent information and activity"
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
             { label: "Profile Settings", icon: UserCircle, href: "#" },
             { label: "Audit Logs", icon: ShieldAlert, href: "#" },
             { label: "System Settings", icon: Settings2, href: "#" },
             { label: "Logout", icon: LogOut, href: "#", className: "text-red-600 hover:text-red-700 hover:bg-red-50" },
        ]}
        actionButtons={[
            { label: "Edit Agent", href: `/admin-dashboard/agents/${id}/edit`, icon: Pencil, className: "bg-blue-600 hover:bg-blue-700 text-white" }
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto space-y-6">
            
            {/* Agent Profile Card */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Profile Header */}
                        <div className="flex-1">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                                    <User className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold text-gray-900">Agent.Rock</h2>
                                    <p className="text-gray-500">agent.rock@kofibenteh.com</p>
                                    <div className="flex gap-2 pt-1">
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">Active</Badge>
                                        <Badge variant="outline" className="text-gray-500 border-gray-200">Agent</Badge>
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
                                    <span className="text-gray-700">agent.rock@kofibenteh.com</span>
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
                                    <span className="text-gray-700">Last login Dec 08, 2025 16:43</span>
                                </div>
                            </div>
                        </div>

                        {/* Location Assignment */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Location Assignment</h3>
                            <div className="space-y-3">
                                <div className="text-sm text-gray-500 italic">
                                    No location assigned
                                </div>
                            </div>
                        </div>

                         {/* Activity Statistics */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Activity Statistics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3">
                                    <div className="text-2xl font-bold text-indigo-600">2</div>
                                    <div className="text-xs text-gray-500">Total Issues</div>
                                </div>
                                <div className="text-center p-3">
                                    <div className="text-2xl font-bold text-green-600">0</div>
                                    <div className="text-xs text-gray-500">Resolved</div>
                                </div>
                                <div className="text-center p-3">
                                    <div className="text-2xl font-bold text-yellow-600">0</div>
                                    <div className="text-xs text-gray-500">Pending</div>
                                </div>
                                <div className="text-center p-3">
                                    <div className="text-2xl font-bold text-blue-600">0</div>
                                    <div className="text-xs text-gray-500">Last 30 Days</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Issues Managed */}
             <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Recent Issues</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">ISSUE</th>
                                    <th className="px-6 py-4">CATEGORY</th>
                                    <th className="px-6 py-4">STATUS</th>
                                    <th className="px-6 py-4">CREATED</th>
                                    <th className="px-6 py-4 text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">aeda</td>
                                    <td className="px-6 py-4 text-gray-600">Health</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">Rejected</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">Oct 01, 2025</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 bg-indigo-50 hover:bg-indigo-100">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">t6r6</td>
                                    <td className="px-6 py-4 text-gray-600">Economic Empowerment</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">Approved</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">Sep 28, 2025</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 bg-indigo-50 hover:bg-indigo-100">
                                             <Eye className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
             </Card>

        </div>
      </div>
    </div>
  );
}
