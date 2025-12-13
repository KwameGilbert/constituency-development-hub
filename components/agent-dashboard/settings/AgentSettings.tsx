"use client";

import React from "react";
import { Camera, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

export function AgentSettings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-500">
          Manage your account details and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="flex items-center gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="text-2xl bg-slate-100 text-slate-500">
              AR
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 rounded-full bg-slate-900 p-2 text-white hover:bg-slate-800">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">Agent.Rock</h2>
          <p className="text-slate-500">Field Agent</p>
          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <Mail className="h-3.5 w-3.5" />
              agent.rock@kofibenteh.com
            </div>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 hover:bg-green-100 gap-1"
            >
              <CheckCircle2 className="h-3 w-3" />
              Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <Tabs defaultValue="profile" className="w-full">
          <div className="border-b border-slate-200 px-6 pt-2">
            <TabsList className="bg-transparent p-0 h-auto gap-6">
              <TabsTrigger
                value="profile"
                className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
              >
                Profile Information
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
              >
                Change Password
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
              >
                Account Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="p-6 space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <Input
                  defaultValue="Agent.Rock"
                  className="border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <Input
                  defaultValue="agent.rock@kofibenteh.com"
                  className="border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <Input
                  placeholder="e.g., +233 20 123 4567"
                  className="border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Department
                </label>
                <Input
                  placeholder="e.g., Community Relations"
                  className="border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Role
                </label>
                <Input
                  defaultValue="Field Agent"
                  readOnly
                  className="bg-slate-50 border-slate-200 text-slate-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                Save Changes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="password" className="p-6 space-y-8">
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Current Password
                </label>
                <Input
                  type="password"
                  className="border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  New Password
                </label>
                <Input
                  type="password"
                  className="border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                />
                <p className="text-xs text-slate-500">Minimum 8 characters</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  className="border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                Update Password
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="account" className="p-6 space-y-8">
            {/* Account Activity */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-900">
                Account Activity
              </h3>
              <div className="rounded-lg bg-slate-50 p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Last Login</span>
                  <span className="font-medium text-slate-900">
                    Dec 08, 2025 16:43
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Account Created</span>
                  <span className="font-medium text-slate-900">
                    Sep 28, 2025
                  </span>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-900">
                Notification Preferences
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="issue-updates" defaultChecked className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900" />
                  <label
                    htmlFor="issue-updates"
                    className="text-sm text-slate-600 cursor-pointer"
                  >
                    Issue status updates
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="task-reminders" defaultChecked className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900" />
                  <label
                    htmlFor="task-reminders"
                    className="text-sm text-slate-600 cursor-pointer"
                  >
                    Task reminders
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="system-notifs" defaultChecked className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900" />
                  <label
                    htmlFor="system-notifs"
                    className="text-sm text-slate-600 cursor-pointer"
                  >
                    System notifications
                  </label>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-900">
                Danger Zone
              </h3>
              <div className="rounded-lg border border-red-100 bg-red-50 p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-red-900">
                    Deactivate Account
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    Temporarily disable your account. You would have to contact
                    your supervisor to reactivate your account.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 bg-white"
                >
                  Deactivate
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
