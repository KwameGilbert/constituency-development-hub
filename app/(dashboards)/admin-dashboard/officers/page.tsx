"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  UserX,
  UserCircle,
  ShieldAlert,
  Settings2,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";

export default function OfficersPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="Officer Management"
        description="Manage all system officers"
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
          {
            label: "Profile Settings",
            href: "/admin-dashboard/profile",
            icon: UserCircle,
          },
          {
            label: "Audit Logs",
            href: "/admin-dashboard/audit",
            icon: ShieldAlert,
          },
          {
            label: "System Settings",
            href: "/admin-dashboard/system-settings",
            icon: Settings2,
          },
          {
            label: "Logout",
            icon: LogOut,
            className: "text-red-600 focus:text-red-600 focus:bg-red-50",
          },
        ]}
        actionButtons={[
          {
            label: "Add New Officer",
            href: "/admin-dashboard/officers/new",
            icon: Plus,
            className: "bg-indigo-900 hover:bg-indigo-800 text-white",
          },
        ]}
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Filters and Search */}
          <Card className="p-4 bg-white">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-700">Officers</h3>
                <p className="text-sm text-gray-500">Total: 1 officers</p>
              </div>
              <div className="flex flex-1 w-full md:w-auto gap-3 items-center justify-end">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search officers by name, email or phone..."
                    className="pl-9 bg-gray-50 border-gray-200"
                  />
                </div>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-800"
                  >
                    All (1)
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-200 text-gray-600"
                  >
                    Active (1)
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-200 text-gray-600"
                  >
                    Inactive (0)
                  </Button>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Search
                </Button>
              </div>
            </div>
          </Card>

          {/* Officers Table */}
          <Card className="bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">NAME</th>
                    <th className="px-6 py-4">CONTACT INFO</th>
                    <th className="px-6 py-4">LOCATION</th>
                    <th className="px-6 py-4">STATUS</th>
                    <th className="px-6 py-4">JOINED</th>
                    <th className="px-6 py-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                          Of
                        </div>
                        <span className="font-medium text-gray-900">
                          Officer.Rock
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      officer.rock@kofibenteh.com
                    </td>
                    <td className="px-6 py-4 text-gray-400 italic">
                      No location assigned
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none px-3 py-1 font-normal">
                        Active
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600">Sep 28, 2025</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                          asChild
                        >
                          <Link href="/admin-dashboard/officers/1">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          asChild
                        >
                          <Link href="/admin-dashboard/officers/1/edit">
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserX className="w-4 h-4" />
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
