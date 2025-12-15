"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, UserX, UserCircle, ShieldAlert, Settings2, LogOut } from "lucide-react";
import Link from "next/link";

export default function EditUserPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader 
        title="Edit User" 
        description="Modify user accounts"
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
            { label: "Back to Profile", href: `/admin-dashboard/users/${params.id}`, icon: ArrowLeft },
            { label: "Deactivate User", icon: UserX, className: "text-gray-700" },
            { label: "Profile Settings", href: "/admin-dashboard/profile", icon: UserCircle },
            { label: "Audit Logs", href: "/admin-dashboard/audit", icon: ShieldAlert },
            { label: "System Settings", href: "/admin-dashboard/system-settings", icon: Settings2 },
            { label: "Logout", icon: LogOut, className: "text-red-600 focus:text-red-600 focus:bg-red-50" },
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>Update the user's personal information and role.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" placeholder="Admin" defaultValue="Admin" />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="lastName">Last Name</Label>
                             <Input id="lastName" placeholder="Rock" defaultValue="Rock" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="admin.rock@kofibenteh.com" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                             <Label htmlFor="role">Role</Label>
                             <Select defaultValue="mp">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mp">Member of Parliament</SelectItem>
                                    <SelectItem value="mce">Municipal Chief Executive</SelectItem>
                                    <SelectItem value="pa">Personal Assistant</SelectItem>
                                    <SelectItem value="officer">Officer</SelectItem>
                                    <SelectItem value="agent">Agent</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="status">Status</Label>
                             <Select defaultValue="active">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                         <Label htmlFor="location">Assigned Location</Label>
                         <Select defaultValue="none">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No location assigned</SelectItem>
                                    <SelectItem value="seiwi">Seiwi</SelectItem>
                                    <SelectItem value="accra">Accra</SelectItem>
                                </SelectContent>
                         </Select>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3">
                         <Button variant="outline" asChild>
                            <Link href={`/admin-dashboard/users/${params.id}`}>Cancel</Link>
                         </Button>
                         <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                            <Save className="w-4 h-4" />
                            Save Changes
                         </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
