"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
    Search, 
    Plus, 
    Eye, 
    Edit, 
    UserX, 
    UserCircle, 
    ShieldAlert, 
    Settings2, 
    LogOut,
} from "lucide-react";
import Link from "next/link";

export default function AgentsPage() {
    return (
        <div className="flex flex-col h-full bg-slate-50">
            <AdminHeader 
                title="Agent Management" 
                description="Manage all system agents"
                roleAbbr="MP"
                userName="Admin.Rock"
                userRoleLabel="MP"
                dropdownItems={[
                    { label: "Profile Settings", href: "/admin-dashboard/profile", icon: UserCircle },
                    { label: "Audit Logs", href: "/admin-dashboard/audit", icon: ShieldAlert },
                    { label: "System Settings", href: "/admin-dashboard/system-settings", icon: Settings2 },
                    { label: "Logout", icon: LogOut, className: "text-red-600 focus:text-red-600 focus:bg-red-50" },
                ]}
                actionButtons={[
                    { label: "Add New Agent", href: "/admin-dashboard/agents/new", icon: Plus, className: "bg-indigo-900 hover:bg-indigo-800 text-white" }
                ]}
            />
            
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    {/* Filters and Search */}
                    <Card className="p-4 bg-white">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-gray-700">Agents</h3>
                                <p className="text-sm text-gray-500">Total: 1 agents</p>
                            </div>
                            <div className="flex flex-1 w-full md:w-auto gap-3 items-center justify-end">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input 
                                        placeholder="Search by name, email or phone..." 
                                        className="pl-9 bg-gray-50 border-gray-200"
                                    />
                                </div>
                                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                                    <Button variant="ghost" size="sm" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-800">All (1)</Button>
                                    <Button variant="ghost" size="sm" className="hover:bg-gray-200 text-gray-600">Active (1)</Button>
                                    <Button variant="ghost" size="sm" className="hover:bg-gray-200 text-gray-600">Inactive (0)</Button>
                                </div>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Search</Button>
                            </div>
                        </div>
                    </Card>

                    {/* Agents Table */}
                    <Card className="bg-white overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4">AGENT</th>
                                        <th className="px-6 py-4">LOCATION</th>
                                        <th className="px-6 py-4">STATUS</th>
                                        <th className="px-6 py-4 text-right">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                                    <UserCircle className="w-6 h-6" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">Agent.Rock</span>
                                                    <span className="text-xs text-gray-500">agent.rock@kofibenteh.com</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 italic">
                                            No location assigned
                                        </td>
                                        <td className="px-6 py-4">
                                             <div className="flex flex-col gap-1">
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none px-2 py-0.5 w-fit font-normal">Active</Badge>
                                                <span className="text-xs text-gray-500">Last login: Dec 08, 2025</span>
                                                <span className="text-xs text-gray-500">Added: Sep 28, 2025</span>
                                             </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 bg-indigo-50" asChild>
                                                    <Link href="/admin-dashboard/agents/1">
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 bg-blue-50" asChild>
                                                    <Link href="/admin-dashboard/agents/1/edit">
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 bg-red-50">
                                                    <UserX className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 bg-yellow-50">
                                                     {/* Key icon replacement or similar for reset, assuming key icon from lucide if available, else just a placeholder action */}
                                                    <Settings2 className="w-4 h-4" /> 
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
