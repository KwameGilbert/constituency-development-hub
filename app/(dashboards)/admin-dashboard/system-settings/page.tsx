"use client";

import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { 
    Save, 
    Bell, 
    Shield, 
    Globe, 
    Mail, 
    Smartphone 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SystemSettingsPage() {
    return (
        <div className="flex flex-col h-full bg-slate-50">
            <AdminHeader 
                title="System Settings" 
                description="Configure system-wide preferences and policies"
            />

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <Tabs defaultValue="general" className="w-full space-y-6">
                        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                        </TabsList>

                        {/* General Settings */}
                        <TabsContent value="general" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>General Configuration</CardTitle>
                                    <CardDescription>
                                        Manage basic system information and status.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="site-name">Application Name</Label>
                                        <Input id="site-name" defaultValue="Constituency Development Hub" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="support-email">Support Email</Label>
                                        <Input id="support-email" defaultValue="support@cdh.gov" />
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Maintenance Mode</Label>
                                            <p className="text-sm text-gray-500">
                                                Temporarily disable access for non-admin users.
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Notifications */}
                        <TabsContent value="notifications" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notification Preferences</CardTitle>
                                    <CardDescription>
                                        Configure how the system sends alerts.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center space-x-4">
                                            <Mail className="w-6 h-6 text-indigo-600" />
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Email Alerts</Label>
                                                <p className="text-sm text-gray-500">
                                                    Receive daily summaries and critical alerts via email.
                                                </p>
                                            </div>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center space-x-4">
                                            <Smartphone className="w-6 h-6 text-indigo-600" />
                                            <div className="space-y-0.5">
                                                <Label className="text-base">SMS Notifications</Label>
                                                <p className="text-sm text-gray-500">
                                                    Receive urgent security alerts via SMS.
                                                </p>
                                            </div>
                                        </div>
                                        <Switch />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Preferences
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Security */}
                        <TabsContent value="security" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Security Policies</CardTitle>
                                    <CardDescription>
                                        Manage system access and authentication rules.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Password Rotation Policy</Label>
                                        <Select defaultValue="90">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select duration" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="30">Every 30 days</SelectItem>
                                                <SelectItem value="60">Every 60 days</SelectItem>
                                                <SelectItem value="90">Every 90 days</SelectItem>
                                                <SelectItem value="never">Never expire</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Two-Factor Authentication (2FA)</Label>
                                            <p className="text-sm text-gray-500">
                                                Enforce 2FA for all admin accounts.
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                        <Save className="w-4 h-4 mr-2" />
                                        Update Security
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
