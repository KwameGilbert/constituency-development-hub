"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Settings,
  Bell,
  Database,
  Palette,
  Shield,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react";

export interface SettingsState {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    newAssignments: boolean;
    statusUpdates: boolean;
    weeklyReport: boolean;
    [key: string]: boolean;
  };
  appearance: {
    theme: string;
    language: string;
    timezone: string;
    [key: string]: string;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: string;
    loginNotifications: boolean;
    [key: string]: boolean | string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      email: true,
      push: false,
      sms: false,
      newAssignments: true,
      statusUpdates: true,
      weeklyReport: false,
    },
    appearance: {
      theme: "light",
      language: "en",
      timezone: "GMT+0",
    },
    security: {
      twoFactor: false,
      sessionTimeout: "30",
      loginNotifications: true,
    },
  });



  const handleSettingChange = (
    category: keyof SettingsState,
    key: string,
    value: string | boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    toast.success("Settings saved successfully.");
  };

  const handleExport = () => {
    toast.info("Data export is not yet available.");
  };

  const handleImport = () => {
    toast.info("Data import is not yet available.");
  };



  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your application preferences and configuration
          </p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-gray-600">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    handleSettingChange("notifications", "email", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Receive browser push notifications
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) =>
                    handleSettingChange("notifications", "push", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-assignments">New Assignment Alerts</Label>
                  <p className="text-sm text-gray-600">
                    Get notified when assigned new issues
                  </p>
                </div>
                <Switch
                  id="new-assignments"
                  checked={settings.notifications.newAssignments}
                  onCheckedChange={(checked) =>
                    handleSettingChange(
                      "notifications",
                      "newAssignments",
                      checked,
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="status-updates">Status Updates</Label>
                  <p className="text-sm text-gray-600">
                    Get notified of issue status changes
                  </p>
                </div>
                <Switch
                  id="status-updates"
                  checked={settings.notifications.statusUpdates}
                  onCheckedChange={(checked) =>
                    handleSettingChange(
                      "notifications",
                      "statusUpdates",
                      checked,
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-report">Weekly Reports</Label>
                  <p className="text-sm text-gray-600">
                    Receive weekly summary reports
                  </p>
                </div>
                <Switch
                  id="weekly-report"
                  checked={settings.notifications.weeklyReport}
                  onCheckedChange={(checked) =>
                    handleSettingChange(
                      "notifications",
                      "weeklyReport",
                      checked,
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.appearance.theme}
                  onValueChange={(value) =>
                    handleSettingChange("appearance", "theme", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={settings.appearance.language}
                  onValueChange={(value) =>
                    handleSettingChange("appearance", "language", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="tw">Twi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  id="two-factor"
                  checked={settings.security.twoFactor}
                  onCheckedChange={(checked) =>
                    handleSettingChange("security", "twoFactor", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="login-notifications">
                    Login Notifications
                  </Label>
                  <p className="text-sm text-gray-600">
                    Get notified of new login attempts
                  </p>
                </div>
                <Switch
                  id="login-notifications"
                  checked={settings.security.loginNotifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange(
                      "security",
                      "loginNotifications",
                      checked,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    handleSettingChange(
                      "security",
                      "sessionTimeout",
                      e.target.value,
                    )
                  }
                  className="w-32"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Export or import your assessment data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleExport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button
                onClick={handleImport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import Data
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="text-sm text-gray-600">
              <p className="mb-2">Data export includes:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Assessment records</li>
                <li>Issue assignments</li>
                <li>Performance metrics</li>
                <li>User preferences</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label>Version</Label>
                <p className="text-gray-600">{process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"}</p>
              </div>
              <div>
                <Label>Last Updated</Label>
                <p className="text-gray-600">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
              <div>
                <Label>Environment</Label>
                <p className="text-gray-600">{process.env.NODE_ENV || "development"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
