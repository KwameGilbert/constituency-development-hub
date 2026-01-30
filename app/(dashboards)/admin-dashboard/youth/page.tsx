"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  UserCircle,
  ShieldAlert,
  Settings2,
  LogOut,
  Briefcase,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  youthRecordsService,
  YouthRecord,
  EMPLOYMENT_STATUSES,
  RECORD_STATUSES,
  EDUCATION_LEVELS,
} from "@/lib/services/youth-records-service";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  employed: number;
  unemployed: number;
  students: number;
  self_employed: number;
}

export default function YouthPage() {
  const [records, setRecords] = useState<YouthRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [employmentFilter, setEmploymentFilter] = useState<string>("");
  const [educationFilter, setEducationFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await youthRecordsService.getYouthRecords({
        page: currentPage,
        limit: 20,
        search: search || undefined,
        status: statusFilter || undefined,
        employment_status: employmentFilter || undefined,
        education_level: educationFilter || undefined,
      });

      if (response.success) {
        setRecords(response.data.records);
        setPagination(response.data.pagination);
        setError(null);
      } else {
        setError(response.message || "Failed to load records");
      }
    } catch (err) {
      console.error("Failed to load youth records:", err);
      setError("Failed to load youth records");
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter, employmentFilter, educationFilter]);

  const fetchStats = async () => {
    try {
      const response = await youthRecordsService.getStatistics();
      if (response.success) {
        setStats(response.data.statistics);
      }
    } catch (err) {
      console.error("Failed to load statistics:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchStats();
  }, [fetchRecords]);

  const handleDelete = async (id: number) => {
    try {
      const response = await youthRecordsService.deleteYouthRecord(id);
      if (response.success) {
        toast.success("Record deleted successfully");
        fetchRecords();
        fetchStats();
      } else {
        toast.error(response.message || "Failed to delete record");
      }
    } catch (err) {
      console.error("Failed to delete record:", err);
      toast.error("Failed to delete record");
    }
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchRecords();
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEmploymentBadgeClass = (status: string) => {
    switch (status) {
      case "employed":
        return "bg-green-50 text-green-700 border-green-200";
      case "unemployed":
        return "bg-red-50 text-red-700 border-red-200";
      case "student":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "self_employed":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatEmploymentStatus = (status: string) => {
    return status.replace("_", "-").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading && records.length === 0) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <AdminHeader
          title="Youth Records Management"
          description="Manage all youth records"
        />
        <div className="flex-1 p-6 space-y-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/6" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <AdminHeader
          title="Youth Records Management"
          description="Manage all youth records"
        />
        <div className="flex-1 p-6 space-y-6">
          <div className="max-w-[1600px] mx-auto">
            <Card className="p-12 text-center">
              <p className="text-red-600 text-lg font-medium">{error}</p>
              <p className="text-slate-500 mt-2">
                Please try refreshing the page
              </p>
              <Button onClick={fetchRecords} className="mt-4">
                Retry
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="Youth Records Management"
        description="Manage all youth records, view, edit, delete, and update employment status."
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
            label: "Add New Youth Record",
            href: "/admin-dashboard/youth/new",
            icon: Plus,
            className: "bg-red-600 hover:bg-red-700 text-white",
          },
        ]}
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Stats Overview */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-wrap gap-6 items-center">
            <h2 className="text-lg font-bold text-gray-900 mr-4">
              Youth Records Management
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span>Total Records: {stats?.total ?? 0}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <span className="text-gray-600">
                Pending: {stats?.pending ?? 0}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600">
                Approved: {stats?.approved ?? 0}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-red-500" />
              <span className="text-gray-600">
                Unemployed: {stats?.unemployed ?? 0}
              </span>
            </div>
            <div className="flex-1"></div>
            <div className="flex gap-2">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                asChild
              >
                <Link href="/admin-dashboard/youth/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Youth Record
                </Link>
              </Button>
              <Button
                variant="outline"
                className="text-gray-700 border-gray-300 bg-slate-700 text-white hover:bg-slate-800 hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Records
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="p-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-medium text-gray-500">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Name, ID, Phone, Community"
                    className="pl-9 bg-gray-50 border-gray-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleFilter()}
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-gray-500">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {RECORD_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-gray-500">
                  Employment
                </label>
                <Select
                  value={employmentFilter}
                  onValueChange={setEmploymentFilter}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="All Employment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employment</SelectItem>
                    {EMPLOYMENT_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-medium text-gray-500">
                  Education Level
                </label>
                <Select
                  value={educationFilter}
                  onValueChange={setEducationFilter}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {EDUCATION_LEVELS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-1">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleFilter}
                >
                  Filter
                </Button>
              </div>
            </div>
          </Card>

          {/* Records List Table */}
          <Card className="bg-white overflow-hidden border-gray-200 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>Education</TableHead>
                  <TableHead>Employment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      No youth records found
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-xs text-gray-600">
                        #{record.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {record.full_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {record.gender
                              ? `${record.gender.charAt(0).toUpperCase() + record.gender.slice(1)}`
                              : ""}
                            {record.age ? `, ${record.age} yrs` : ""}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {record.phone || "-"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {record.community || "-"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {record.education_level
                          ? EDUCATION_LEVELS.find(
                              (e) => e.value === record.education_level,
                            )?.label || record.education_level
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getEmploymentBadgeClass(
                            record.employment_status,
                          )}
                        >
                          {formatEmploymentStatus(record.employment_status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusBadgeClass(record.status)}
                        >
                          {record.status.charAt(0).toUpperCase() +
                            record.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                            title="View Details"
                            asChild
                          >
                            <Link href={`/admin-dashboard/youth/${record.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                            title="Edit"
                            asChild
                          >
                            <Link
                              href={`/admin-dashboard/youth/${record.id}/edit`}
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Record
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the record for{" "}
                                  <strong>{record.full_name}</strong>? This
                                  action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(record.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total} records
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.page <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.total_pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(pagination.total_pages, p + 1),
                      )
                    }
                    disabled={pagination.page >= pagination.total_pages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
