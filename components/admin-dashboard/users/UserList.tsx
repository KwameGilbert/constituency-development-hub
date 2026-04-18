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
  UserPlus,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { userService, User } from "@/lib/services/user-service";
import { Card, CardContent } from "@/components/ui/card";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, statusFilter, searchTerm]);

  const tabs = [
    {
      name: "All",
      value: "all",
      count: stats?.users_by_role
        ? Object.values(stats.users_by_role).reduce((a, b) => a + b, 0)
        : 0,
    },
    { name: "Admins", value: "admin", count: stats?.users_by_role.admin || 0 },
    {
      name: "Web Admins",
      value: "web_admin",
      count: stats?.users_by_role.web_admin || 0,
    },
    {
      name: "Officers",
      value: "officer",
      count: stats?.users_by_role.officer || 0,
    },
    { name: "Agents", value: "agent", count: stats?.users_by_role.agent || 0 },
    {
      name: "Task Force",
      value: "task_force",
      count: stats?.users_by_role.task_force || 0,
    },
  ];

  const getRoleBadgeColor = (roleType: string) => {
    switch (roleType) {
      case "admin":
        return "bg-amber-100 text-amber-700 border-amber-200/50";
      case "web_admin":
        return "bg-slate-900 text-slate-100 border-slate-800";
      case "officer":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "agent":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "task_force":
        return "bg-orange-50 text-orange-700 border-orange-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const handleDeleteUser = async (user: User) => {
    const result = await Swal.fire({
      title: "Delete user?",
      text: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: 'rounded-2xl border-none shadow-xl',
        confirmButton: 'rounded-xl px-6 py-2',
        cancelButton: 'rounded-xl px-6 py-2'
      }
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
      <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
        <CardContent className="p-2 flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setRoleFilter(tab.value)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center gap-2 ${
                roleFilter === tab.value
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {tab.name}
              <span className={`px-1.5 py-0.5 rounded-lg text-[10px] ${
                roleFilter === tab.value ? "bg-slate-950/10" : "bg-slate-100 text-slate-400"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <Input
            placeholder="Search by name, email or location..."
            className="pl-11 h-12 bg-white border-none shadow-md shadow-slate-200/40 rounded-2xl focus-visible:ring-amber-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 flex-wrap">
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 bg-white border-none shadow-md shadow-slate-200/40 rounded-2xl focus:ring-amber-500">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <SelectValue placeholder="All Statuses" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active Residents</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            asChild
            className="h-12 px-6 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl shadow-lg transition-all"
          >
            <Link href="/admin-dashboard/users/new">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Table Content */}
      <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden bg-white">
        <div className="overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 border-b border-slate-100 hover:bg-slate-50/50">
                <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  User Identification
                </TableHead>
                <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Platform Role
                </TableHead>
                <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Assigned Location
                </TableHead>
                <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Account Status
                </TableHead>
                <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                      <span className="text-xs font-bold uppercase tracking-widest">Indexing Users...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <p className="text-red-500 font-bold">{error}</p>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <p className="text-slate-400 font-bold italic">No matching users found</p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 group transition-colors">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 ring-2 ring-slate-100 group-hover:ring-amber-500/20 transition-all">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                            {user.name}
                          </span>
                          <span className="text-xs text-slate-500 font-medium tracking-tight">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border shadow-sm ${getRoleBadgeColor(user.role)}`}
                      >
                        {roleDisplayNames[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-xs font-semibold text-slate-600 truncate max-w-[200px]">
                          {user.location || "System Root"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col">
                        <span
                          className={`text-[10px] inline-flex w-fit items-center px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mb-1 ${
                            user.status === "active"
                              ? "text-emerald-700 bg-emerald-50 border border-emerald-100"
                              : "text-red-700 bg-red-50 border border-red-100"
                          }`}
                        >
                          {user.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Login: {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl hover:bg-amber-50 hover:text-amber-600 text-slate-400 transition-all"
                        >
                          <Link href={`/admin-dashboard/users/${user.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-slate-400 transition-all"
                        >
                          <Link href={`/admin-dashboard/users/${user.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 text-slate-400 transition-all"
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
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Improved Pagination */}
        {!loading && !error && totalPages > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Page <span className="text-slate-900">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-white"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-white"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-white"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-white"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

const MapPin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
