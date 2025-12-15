"use client";

import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MapPin, Lock, Info, Save, Shield } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="flex flex-col h-full bg-slate-50">
            <AdminHeader 
                title="Profile Settings" 
                description="Manage your account information and preferences"
            />

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Profile Card */}
                        <Card>
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                                    <User className="h-12 w-12 text-indigo-600" />
                                </div>
                                <h2 className="text-xl font-bold text-[#1e1b4b]">Admin.Rock</h2>
                                <p className="text-muted-foreground text-sm mb-2">Super Administrator</p>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-6">Active</Badge>

                                <div className="w-full space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Email:</span>
                                        <span className="font-medium">admin.rock@parliament.gov</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Member Since:</span>
                                        <span className="font-medium">Jan 2024</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Last Login:</span>
                                        <span className="font-medium">Dec 14, 2025</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Activity Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-100 rounded text-blue-600">
                                            <Info className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium">Total Users</span>
                                    </div>
                                    <span className="font-bold">124</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-yellow-100 rounded text-yellow-600">
                                            <Info className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium">Pending Approvals</span>
                                    </div>
                                    <span className="font-bold">12</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-green-100 rounded text-green-600">
                                            <Info className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium">System Health</span>
                                    </div>
                                    <span className="font-bold text-green-600">98%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-purple-100 rounded text-purple-600">
                                            <Shield className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium">Audit Logs</span>
                                    </div>
                                    <span className="font-bold">450+</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Update Profile Information</CardTitle>
                                <p className="text-sm text-muted-foreground">Keep your profile information up to date</p>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[#1e1b4b] font-semibold">
                                        <User className="h-4 w-4" />
                                        <h3>Personal Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                                            <Input id="fullName" defaultValue="Admin.Rock" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                                            <Input id="email" defaultValue="admin.rock@parliament.gov" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" defaultValue="+233 20 000 0000" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department</Label>
                                            <Input id="department" defaultValue="Administration" />
                                        </div>
                                    </div>
                                </div>

                                {/* Location Information */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[#1e1b4b] font-semibold">
                                        <MapPin className="h-4 w-4" />
                                        <h3>Location Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Main Community</Label>
                                            <Input value="Headquarters" disabled className="bg-muted" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Smaller Community</Label>
                                            <Input value="N/A" disabled className="bg-muted" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Suburb</Label>
                                            <Input value="N/A" disabled className="bg-muted" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Cottage</Label>
                                            <Input value="N/A" disabled className="bg-muted" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Info className="h-3 w-3" /> Location information is managed by system configuration.
                                    </p>
                                </div>

                                {/* Change Password */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[#1e1b4b] font-semibold">
                                        <Lock className="h-4 w-4" />
                                        <h3>Change Password <span className="text-sm font-normal text-muted-foreground">(Leave blank to keep current password)</span></h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Current Password</Label>
                                            <Input id="currentPassword" type="password" placeholder="Enter current password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input id="newPassword" type="password" placeholder="Enter new password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                            <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                                        </div>
                                    </div>
                                </div>

                                {/* Account Information */}
                                <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
                                    <h3 className="font-semibold text-sm text-[#1e1b4b]">Account Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="flex gap-2">
                                            <span className="text-muted-foreground">Account Created:</span>
                                            <span>Jan 01, 2024 09:00</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-muted-foreground">Last Updated:</span>
                                            <span>Dec 14, 2025 10:28</span>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <span className="text-muted-foreground">Account Status:</span>
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 h-5 px-1.5 text-[10px]">Active</Badge>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-muted-foreground">User Role:</span>
                                            <span>Super Administrator</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button className="bg-[#1e1b4b] hover:bg-[#1e1b4b]/90 gap-2">
                                        <Save className="h-4 w-4" />
                                        Update Profile
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
