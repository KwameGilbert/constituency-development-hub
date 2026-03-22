"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  Eye,
  Edit,
  UserX,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";
import { userService, User } from "@/lib/services/user-service";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import {
  dashboardService,
  AdminDashboardStats,
} from "@/lib/services/dashboard-service";
import Swal from "sweetalert2";

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  // Role mapping for display
  const roleDisplayNames: Record<User["role"], string> = {
    admin: "Admin",
    web_admin: "Web Admin",
    officer: "Officer",
    agent: "Agent",
    task_force: "Task Force",
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersRes, statsRes] = await Promise.all([
        userService.getUsers({
          page: currentPage,
          limit: pageSize,
          role: roleFilter !== "all" ? roleFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: searchTerm || undefined,
        }),
        dashboardService.getAdminStats(),
      ]);

      if (usersRes.success && usersRes.data.users) {
        setUsers(usersRes.data.users);
        if (usersRes.data.pagination) {
          setTotalPages(usersRes.data.pagination.total_pages);
          setTotalUsers(usersRes.data.pagination.total);
        }
      } else {
        setError(usersRes.message || "Failed to load users");
      }

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      setError("Failed to load data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, roleFilter, statusFilter, searchTerm]);

  // Fetch users and stats
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, statusFilter, searchTerm]);

  // Use stats for counts if available
  const tabs = [
    {
      name: "All Users",
      value: "all",
      count: stats?.users_by_role
        ? Object.values(stats.users_by_role).reduce((a, b) => a + b, 0)
        : 0,
    },
    { name: "Admin", value: "admin", count: stats?.users_by_role.admin || 0 },
    {
      name: "Web Admin",
      value: "web_admin",
      count: stats?.users_by_role.web_admin || 0,
    },
    {
      name: "Officer",
      value: "officer",
      count: stats?.users_by_role.officer || 0,
    },
    { name: "Agent", value: "agent", count: stats?.users_by_role.agent || 0 },
    {
      name: "Task Force",
      value: "task_force",
      count: stats?.users_by_role.task_force || 0,
    },
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

  const handleDeleteUser = async (user: User) => {
    const result = await Swal.fire({
      title: "Delete user?",
      text: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeletingUserId(user.id);
      await userService.deleteUser(user.id);
      await Swal.fire({
        title: "Deleted",
        text: "User deleted successfully.",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });
      await fetchData();
    } catch (err) {
      console.error("Error deleting user:", err);
      const message =
        err instanceof Error ? err.message : "Failed to delete user";
      await Swal.fire({
        title: "Delete failed",
        text: message,
        icon: "error",
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setRoleFilter(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              roleFilter === tab.value
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
        {/* <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button> */}
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
                        onClick={() => handleDeleteUser(user)}
                        disabled={deletingUserId === user.id}
                      >
                        {deletingUserId === user.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserX className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-900">
              {Math.min(currentPage * pageSize, totalUsers)}
            </span>{" "}
            of <span className="font-medium text-gray-900">{totalUsers}</span>{" "}
            users
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-4">
              <span className="text-sm text-gray-500">Rows per page:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
