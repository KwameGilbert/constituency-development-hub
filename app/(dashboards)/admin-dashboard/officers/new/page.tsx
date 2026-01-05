"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, UserPlus, User, MapPin, Lock, Info, UserCircle, ShieldAlert, Settings2, LogOut } from "lucide-react";
import Link from "next/link";

export default function AddOfficerPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader 
        title="Officer Management" 
        description="Manage all system officers"
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
          { label: "Back to Dashboard", href: "/admin-dashboard/officers", icon: ArrowLeft, className: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm" }
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
            <Card className="border-t-4 border-t-red-900">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-xl text-gray-900">Officer Management</CardTitle>
                        <span className="px-2 py-0.5 rounded-full bg-red-900 text-white text-xs font-bold">MP</span>
                    </div>
                    <CardDescription>Manage all system officers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    
                    {/* Header for Form */}
                    <div className="flex justify-between items-center bg-indigo-900 text-white p-4 rounded-lg">
                        <h3 className="font-semibold">+ Add New Officer</h3>
                        <div className="w-8 h-8 rounded-full bg-white text-indigo-900 flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                    </div>
                    
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-gray-700">Full Name <span className="text-red-500">*</span></Label>
                                <Input id="fullName" placeholder="Enter officer name" defaultValue="Officer.Rock" />
                            </div>
                            <div className="space-y-2">
                                 <Label htmlFor="email" className="text-gray-700">Email Address <span className="text-red-500">*</span></Label>
                                 <Input id="email" type="email" placeholder="Enter email address" defaultValue="officer.rock@kofibenteh.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-gray-700">Phone Number <span className="text-red-500">*</span></Label>
                                <Input id="phone" placeholder="Enter phone number" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-gray-700">Status <span className="text-red-500">*</span></Label>
                                <Select defaultValue="active">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Location Assignment */}
                    <div className="space-y-4">
                        <h3 className="text-gray-900 font-semibold text-lg border-b border-gray-100 pb-2">Location Assignment</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label htmlFor="mainCommunity" className="text-gray-700">Main Community <span className="text-red-500">*</span></Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Main Community" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="comm1">Community 1</SelectItem>
                                        <SelectItem value="comm2">Community 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="smallerCommunity" className="text-gray-700">Smaller Community</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Smaller Community" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="small1">Smaller Comm 1</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="suburb" className="text-gray-700">Suburb</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Suburb" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sub1">Suburb 1</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="cottage" className="text-gray-700">Cottage</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Cottage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cot1">Cottage 1</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                         <Button variant="outline" asChild className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700">
                            <Link href="/admin-dashboard/officers">Cancel</Link>
                         </Button>
                         <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                            <UserPlus className="w-4 h-4" />
                            Add Officer
                         </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
