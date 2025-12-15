"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Edit, UserX, Search } from "lucide-react";
import Link from "next/link";

export function UserList() {
  const [activeTab, setActiveTab] = useState("All Users");

  // Mock data matching the screenshot
  const users = [
    {
      id: 1,
      name: "Admin.Rock",
      email: "admin.rock@kofibenteh.com",
      role: "Member of Parliament",
      roleType: "mp", // for badge styling
      location: "No location assigned",
      status: "Active",
      lastLogin: "Dec 11, 2025",
      added: "Sep 28, 2025"
    },
    {
      id: 2,
      name: "Officer.Rock",
      email: "officer.rock@kofibenteh.com",
      role: "Officer",
      roleType: "officer",
      location: "No location assigned",
      status: "Active",
      lastLogin: "Dec 08, 2025",
      added: "Sep 28, 2025"
    },
    {
      id: 3,
      name: "Agent.Rock",
      email: "agent.rock@kofibenteh.com",
      role: "Agent",
      roleType: "agent",
      location: "No location assigned",
      status: "Active",
      lastLogin: "Dec 08, 2025",
      added: "Sep 28, 2025"
    }
  ];

  const tabs = [
    { name: "All Users", count: 3 },
    { name: "Member of Parliament", count: 1 },
    { name: "Municipal Chief Executive", count: 0 },
    { name: "Personal Assistant", count: 0 },
    { name: "Officer", count: 1 },
    { name: "Agent", count: 1 },
    { name: "Admin", count: 0 },
  ];

  const getRoleBadgeColor = (roleType: string) => {
    switch (roleType) {
      case "mp": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "officer": return "bg-green-100 text-green-700 hover:bg-green-100";
      case "agent": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.name
                ? "bg-slate-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.name} ({tab.count})
          </button>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
         <div className="w-full sm:w-48">
             <Select defaultValue="all">
                <SelectTrigger className="bg-white">
                    <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
             </Select>
         </div>
         <div className="flex-1 flex gap-2">
             <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <Input 
                    placeholder="Search by name, email or department..." 
                    className="pl-10 w-full"
                 />
             </div>
             <Button className="bg-indigo-900 hover:bg-indigo-800">
                <Search className="w-4 h-4 mr-2" />
                Search
             </Button>
         </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="font-semibold text-gray-600">USER</TableHead>
                <TableHead className="font-semibold text-gray-600">ROLE</TableHead>
                <TableHead className="font-semibold text-gray-600">LOCATION</TableHead>
                <TableHead className="font-semibold text-gray-600">STATUS</TableHead>
                <TableHead className="font-semibold text-gray-600 text-right pr-6">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-indigo-50 border border-indigo-100">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-indigo-600 bg-indigo-50">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{user.name}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`font-normal rounded-full ${getRoleBadgeColor(user.roleType)}`}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                    <span className="text-gray-500 text-sm">{user.location}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                     <span className="text-xs inline-flex w-fit items-center px-2 py-0.5 rounded text-green-700 bg-green-50 font-medium mb-1">
                        {user.status}
                     </span>
                     <span className="text-[10px] text-gray-400">Last login: {user.lastLogin}</span>
                     <span className="text-[10px] text-gray-400">Added: {user.added}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                   <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700">
                        <Link href={`/admin-dashboard/users/${user.id}`}>
                            <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">
                        <Link href={`/admin-dashboard/users/${user.id}/edit`}>
                            <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700">
                        <UserX className="w-4 h-4" />
                      </Button>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
