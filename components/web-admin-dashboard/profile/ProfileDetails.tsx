"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Lock, Info, Save, FileText, Calendar, Image as ImageIcon } from "lucide-react";

export function ProfileDetails() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
                {/* Profile Card */}
                <Card className="border-violet-100 shadow-sm">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-full bg-violet-100 flex items-center justify-center mb-4 border-2 border-violet-200">
                            <User className="h-12 w-12 text-violet-600" />
                        </div>
                        <h2 className="text-xl font-bold text-violet-950">Web Admin</h2>
                        <p className="text-muted-foreground text-sm mb-2">Administrator</p>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-6 border-green-200">Active</Badge>

                        <div className="w-full space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-medium text-violet-950">admin@constituencyhub.com</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Member Since:</span>
                                <span className="font-medium text-violet-950">Jan 2024</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Login:</span>
                                <span className="font-medium text-violet-950">Today, 10:30 AM</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Overview */}
                <Card className="border-violet-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base text-violet-950">Activity Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-100 rounded text-blue-600">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">Blog Posts</span>
                            </div>
                            <span className="font-bold text-violet-950">12</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-green-100 rounded text-green-600">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">Events Managed</span>
                            </div>
                            <span className="font-bold text-violet-950">5</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-purple-100 rounded text-purple-600">
                                    <ImageIcon className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">Carousel Items</span>
                            </div>
                            <span className="font-bold text-violet-950">8</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2">
                <Card className="border-violet-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-violet-950">Update Profile Information</CardTitle>
                        <p className="text-sm text-muted-foreground">Keep your profile information up to date</p>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-violet-900 font-semibold">
                                <User className="h-4 w-4" />
                                <h3>Personal Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                                    <Input id="fullName" defaultValue="Web Admin" className="focus-visible:ring-violet-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                                    <Input id="email" defaultValue="admin@constituencyhub.com" className="focus-visible:ring-violet-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" placeholder="e.g., +233 20 123 4567" className="focus-visible:ring-violet-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Input id="role" value="Administrator" disabled className="bg-slate-100 text-slate-500" />
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-violet-100" />

                        {/* Change Password */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-violet-900 font-semibold">
                                <Lock className="h-4 w-4" />
                                <h3>Change Password <span className="text-sm font-normal text-muted-foreground">(Leave blank to keep current password)</span></h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input id="currentPassword" type="password" placeholder="Enter current password" className="focus-visible:ring-violet-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input id="newPassword" type="password" placeholder="Enter new password" className="focus-visible:ring-violet-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input id="confirmPassword" type="password" placeholder="Confirm new password" className="focus-visible:ring-violet-500" />
                                </div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="bg-violet-50/50 p-4 rounded-lg border border-violet-100 space-y-4">
                            <h3 className="font-semibold text-sm text-violet-900">Account Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex gap-2">
                                    <span className="text-muted-foreground">Account Created:</span>
                                    <span className="text-violet-950">Jan 15, 2024 09:00</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-muted-foreground">Last Updated:</span>
                                    <span className="text-violet-950">Dec 08, 2025 14:20</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="text-muted-foreground">Account Status:</span>
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 h-5 px-1.5 text-[10px] border-green-200">Active</Badge>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-muted-foreground">User Role:</span>
                                    <span className="text-violet-950">Administrator</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button className="bg-violet-900 hover:bg-violet-800 gap-2">
                                <Save className="h-4 w-4" />
                                Update Profile
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
