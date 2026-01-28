"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Edit, UserX, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { userService, User } from "@/lib/services/user-service";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All Users");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Role mapping for display
  const roleDisplayNames: Record<User["role"], string> = {
    admin: "Admin",
    web_admin: "Web Admin",
    officer: "Officer",
    agent: "Agent",
    task_force: "Task Force",
  };

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getUsers({
          role: roleFilter !== "all" ? roleFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: searchTerm || undefined,
        });

        if (response.success && response.data.users) {
          setUsers(response.data.users);
        } else {
          setError(response.message || "Failed to load users");
        }
      } catch (err) {
        setError("Failed to load users");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [roleFilter, statusFilter, searchTerm]);

  // Calculate tab counts
  const getTabCounts = () => {
    const counts = {
      "All Users": users.length,
      Admin: users.filter((u) => u.role === "admin").length,
      "Web Admin": users.filter((u) => u.role === "web_admin").length,
      Officer: users.filter((u) => u.role === "officer").length,
      Agent: users.filter((u) => u.role === "agent").length,
      "Task Force": users.filter((u) => u.role === "task_force").length,
    };
    return counts;
  };

  const tabCounts = getTabCounts();

  const tabs = [
    { name: "All Users", count: tabCounts["All Users"] },
    { name: "Admin", count: tabCounts["Admin"] },
    { name: "Web Admin", count: tabCounts["Web Admin"] },
    { name: "Officer", count: tabCounts["Officer"] },
    { name: "Agent", count: tabCounts["Agent"] },
    { name: "Task Force", count: tabCounts["Task Force"] },
  ];

  const getRoleBadgeColor = (roleType: string) => {
    switch (roleType) {
      case "admin":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "web_admin":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100";
      case "officer":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "agent":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "task_force":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleSearch = () => {
    // The search is triggered automatically via useEffect when searchTerm changes
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
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-indigo-900 hover:bg-indigo-800"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading users...</span>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="p-4 text-center text-red-600">{error}</Card>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="font-semibold text-gray-600">
                  USER
                </TableHead>
                <TableHead className="font-semibold text-gray-600">
                  ROLE
                </TableHead>
                <TableHead className="font-semibold text-gray-600">
                  LOCATION
                </TableHead>
                <TableHead className="font-semibold text-gray-600">
                  STATUS
                </TableHead>
                <TableHead className="font-semibold text-gray-600 text-right pr-6">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-indigo-50 border border-indigo-100">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-indigo-600 bg-indigo-50">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {user.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`font-normal rounded-full ${getRoleBadgeColor(user.role)}`}
                    >
                      {roleDisplayNames[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-500 text-sm">
                      {user.location || "No location assigned"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span
                        className={`text-xs inline-flex w-fit items-center px-2 py-0.5 rounded font-medium mb-1 ${
                          user.status === "active"
                            ? "text-green-700 bg-green-50"
                            : "text-red-700 bg-red-50"
                        }`}
                      >
                        {user.status}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Last login:{" "}
                        {user.last_login
                          ? new Date(user.last_login).toLocaleDateString()
                          : "Never"}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Added:{" "}
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700"
                      >
                        <Link href={`/admin-dashboard/users/${user.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                      >
                        <Link href={`/admin-dashboard/users/${user.id}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700"
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
