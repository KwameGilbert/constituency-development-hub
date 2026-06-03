"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
  GraduationCap,
  Users,
  MapPin,
  Clock,
  ExternalLink,
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
      setError("System failure in record synchronization");
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
        toast.success("Youth profile deactivated");
        fetchRecords();
        fetchStats();
      } else {
        toast.error(response.message || "Execution failure");
      }
    } catch (err) {
      toast.error("Process error");
    }
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchRecords();
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100 font-bold";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-100 font-bold";
      default:
        return "bg-slate-50 text-slate-500 border-slate-100 font-medium";
    }
  };

  const getEmploymentBadgeClass = (status: string) => {
    switch (status) {
      case "employed":
        return "bg-slate-900 text-slate-50 border-slate-800 font-black";
      case "unemployed":
        return "bg-red-50 text-red-700 border-red-100 font-bold";
      case "student":
        return "bg-indigo-50 text-indigo-700 border-indigo-100 font-bold";
      case "self_employed":
        return "bg-amber-50 text-amber-900 border-amber-200/50 font-bold";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/50 font-medium";
    }
  };

  const formatEmploymentStatus = (status: string) => {
    return status.replace("_", " ").toUpperCase();
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <AdminHeader
        title="YouthHub"
        description="Unified registry for youth development and human capital oversight"
        roleAbbr="MP"
        dropdownItems={[
          {
            label: "System Audit",
            href: "/admin-dashboard/audit",
            icon: ShieldAlert,
          },
          {
            label: "Logout",
            icon: LogOut,
            className: "text-red-500 font-bold",
          },
        ]}
      />

      <div className="flex-1 p-8 space-y-8 max-w-[1600px] mx-auto w-full">
        {/* Strategic Stats Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl bg-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full -mr-8 -mt-8" />
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-500">
                <Users className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Master Registry</span>
                <span className="text-3xl font-black text-slate-950 tracking-tighter">{stats?.total ?? 0}</span>
                <span className="text-xs font-semibold text-amber-600 mt-1 uppercase tracking-wide">Active Entities</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl bg-white overflow-hidden relative group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                <Briefcase className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Employment Base</span>
                <span className="text-3xl font-black text-slate-950 tracking-tighter">{stats?.employed ?? 0}</span>
                <span className="text-xs font-semibold text-emerald-600 mt-1 uppercase tracking-wide">Workforce Ready</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl bg-white overflow-hidden relative group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Human Capital</span>
                <span className="text-3xl font-black text-slate-950 tracking-tighter">{stats?.students ?? 0}</span>
                <span className="text-xs font-semibold text-indigo-600 mt-1 uppercase tracking-wide">Active Scholars</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl bg-white overflow-hidden relative group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-500">
                <Clock className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Pending Review</span>
                <span className="text-3xl font-black text-slate-950 tracking-tighter">{stats?.pending ?? 0}</span>
                <span className="text-xs font-semibold text-amber-600 mt-1 uppercase tracking-wide">Awaiting Validation</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Action Bar */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
           <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-amber-500 rounded-full" />
            <div>
              <h2 className="text-3xl font-bold text-slate-950 tracking-tight">
                Records Management
              </h2>
              <p className="text-slate-500 font-medium text-sm mt-0.5">
                {loading ? "Synchronizing ledger metadata..." : `Overseeing ${pagination?.total ?? 0} specialized personnel records`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
             <Link href="/admin-dashboard/youth/new" className="flex-1 lg:flex-none">
              <Button className="w-full h-12 px-6 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 group">
                <div className="p-1.5 bg-amber-500 rounded-lg group-hover:rotate-12 transition-transform shadow-md shadow-amber-500/20">
                   <Plus className="h-4 w-4 text-slate-950" />
                </div>
                Draft New Profile
              </Button>
            </Link>
            <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 bg-white text-slate-700 font-black text-xs uppercase tracking-widest flex items-center gap-3 group hover:bg-slate-50 transition-all">
              <Download className="h-4 w-4 text-slate-400 group-hover:text-amber-500" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters and Matrix Context */}
        <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl bg-white overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-4 relative group">
                 <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 block ml-1">Registry Search</Label>
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                    <Input
                      placeholder="Name, ID, Phone, Community..."
                      className="h-12 pl-12 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-bold"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleFilter()}
                    />
                 </div>
              </div>
              
              <div className="md:col-span-2">
                <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 block ml-1">Validation Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold text-slate-700">
                    <SelectValue placeholder="All Clusters" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="all" className="font-bold">All Clusters</SelectItem>
                    {RECORD_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value} className="font-bold uppercase tracking-wider text-xs">
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 block ml-1">Economic Mode</Label>
                <Select value={employmentFilter} onValueChange={setEmploymentFilter}>
                  <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold text-slate-700">
                    <SelectValue placeholder="Unified Mode" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="all" className="font-bold">Unified Mode</SelectItem>
                    {EMPLOYMENT_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value} className="font-bold uppercase tracking-wider text-xs">
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-3">
                <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 block ml-1">Academic Rank</Label>
                <Select value={educationFilter} onValueChange={setEducationFilter}>
                  <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold text-slate-700">
                    <SelectValue placeholder="All Tiers" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="all" className="font-bold">All Tiers</SelectItem>
                    {EDUCATION_LEVELS.map((s) => (
                      <SelectItem key={s.value} value={s.value} className="font-bold uppercase tracking-wider text-xs">
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-1">
                <Button
                  className="w-full h-12 bg-slate-950 text-white hover:bg-slate-800 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-slate-900/20"
                  onClick={handleFilter}
                >
                  Sync
                </Button>
              </div>
            </div>

            {/* Records Visualization Table */}
            <div className="rounded-2xl border border-slate-50 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[80px]">Registry</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject Profile</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Community</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Academic Rank</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Economics</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</TableHead>
                    <TableHead className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-24">
                        <div className="flex flex-col items-center gap-3">
                           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                              <Users className="w-8 h-8" />
                           </div>
                           <p className="text-slate-400 font-bold italic">No matching records found in registry</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((record) => (
                      <TableRow key={record.id} className="hover:bg-slate-50 transition-colors group">
                        <TableCell className="px-6 py-5">
                           <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-amber-600 transition-colors">#{record.id}</span>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <div className="flex flex-col min-w-max">
                            <span className="font-bold text-slate-950 text-sm group-hover:text-amber-600 transition-colors">
                              {record.full_name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5 text-slate-400 font-bold">
                              <span className="text-xs uppercase tracking-wider">{record.gender} • {record.age} YRS</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                           <div className="flex items-center gap-1.5 text-slate-600">
                              <MapPin className="w-3.5 h-3.5 text-slate-300" />
                              <span className="text-xs font-bold truncate max-w-[150px]">{record.community || "N/A"}</span>
                           </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            {record.education_level ? 
                              EDUCATION_LEVELS.find(e => e.value === record.education_level)?.label || record.education_level
                              : "N/A"}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <Badge className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 border shadow-xs ${getEmploymentBadgeClass(record.employment_status)}`}>
                            {formatEmploymentStatus(record.employment_status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <Badge className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 border shadow-xs ${getStatusBadgeClass(record.status)}`}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/admin-dashboard/youth/${record.id}`}>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-950">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin-dashboard/youth/${record.id}/edit`}>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                                <div className="p-8 space-y-4">
                                   <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                      <Trash2 className="w-8 h-8" />
                                   </div>
                                   <AlertDialogHeader>
                                      <AlertDialogTitle className="text-2xl font-black text-slate-950 tracking-tight">Purge Record</AlertDialogTitle>
                                      <AlertDialogDescription className="text-slate-500 font-medium text-base">
                                        Are you absolutely certain you want to delete the record for &quot;{record.full_name}&quot;? This action will permanently remove all associated developmental history.
                                      </AlertDialogDescription>
                                   </AlertDialogHeader>
                                </div>
                                <AlertDialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex-row gap-4">
                                  <AlertDialogCancel className="flex-1 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-white border-slate-100">Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(record.id)}
                                    className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-600/20"
                                  >
                                    Confirm Purge
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </Table>
          </div>

          {/* Improved Pagination Matrix */}
          {pagination && pagination.total_pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
               <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Showing <span className="text-slate-950">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="text-slate-950">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-slate-950">{pagination.total}</span>
                </div>

              <div className="flex items-center gap-3">
                 <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white border border-transparent hover:border-slate-100 shadow-xs" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={pagination.page <= 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs font-black text-slate-900 px-3 py-1 bg-white rounded-lg border border-slate-100">
                  {pagination.page} / {pagination.total_pages}
                </span>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white border border-transparent hover:border-slate-100 shadow-xs" onClick={() => setCurrentPage((p) => Math.min(pagination.total_pages, p + 1))} disabled={pagination.page >= pagination.total_pages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  );
}