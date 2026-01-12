"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pencil,
  ArrowLeft,
  UserCircle,
  ShieldAlert,
  Settings2,
  LogOut,
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  youthRecordsService,
  YouthRecord,
  EDUCATION_LEVELS,
  EMPLOYMENT_STATUSES,
} from "@/lib/services/youth-records-service";
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

export default function YouthDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [record, setRecord] = useState<YouthRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchRecord = useCallback(async () => {
    try {
      setLoading(true);
      const response = await youthRecordsService.getYouthRecordById(Number(id));
      if (response.success) {
        setRecord(response.data.record);
        setError(null);
      } else {
        setError(response.message || "Failed to load record");
      }
    } catch (err) {
      console.error("Failed to load youth record:", err);
      setError("Failed to load youth record");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  const handleStatusUpdate = async (newStatus: "approved" | "rejected") => {
    try {
      setUpdatingStatus(true);
      const response = await youthRecordsService.updateYouthRecordStatus(
        Number(id),
        { status: newStatus }
      );
      if (response.success) {
        toast.success(
          `Record ${newStatus === "approved" ? "approved" : "rejected"} successfully`
        );
        setRecord(response.data.record);
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-700 border-none">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 border-none">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-none">
            Pending
          </Badge>
        );
    }
  };

  const formatEmploymentStatus = (status: string) => {
    const found = EMPLOYMENT_STATUSES.find((s) => s.value === status);
    return found?.label || status;
  };

  const formatEducationLevel = (level: string | null) => {
    if (!level) return "-";
    const found = EDUCATION_LEVELS.find((e) => e.value === level);
    return found?.label || level;
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <AdminHeader title="Youth Details" description="Loading record..." />
        <div className="flex-1 p-6 space-y-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <Card className="p-8">
              <div className="flex gap-6">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64 lg:col-span-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <AdminHeader title="Youth Details" description="Error loading record" />
        <div className="flex-1 p-6">
          <div className="max-w-[1600px] mx-auto">
            <Card className="p-12 text-center">
              <p className="text-red-600 text-lg font-medium">
                {error || "Record not found"}
              </p>
              <Button className="mt-4" asChild>
                <Link href="/admin-dashboard/youth">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to List
                </Link>
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
        title="Youth Details"
        description="View youth record details"
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
          { label: "Profile Settings", href: "#", icon: UserCircle },
          { label: "Audit Logs", href: "#", icon: ShieldAlert },
          { label: "System Settings", href: "#", icon: Settings2 },
          {
            label: "Logout",
            icon: LogOut,
            href: "#",
            className: "text-red-600 hover:text-red-700 hover:bg-red-50",
          },
        ]}
        actionButtons={[
          {
            label: "Edit Record",
            href: `/admin-dashboard/youth/${id}/edit`,
            icon: Pencil,
            className: "bg-blue-600 hover:bg-blue-700 text-white",
          },
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Back Button */}
          <Button variant="ghost" asChild className="text-gray-600">
            <Link href="/admin-dashboard/youth">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Youth Records
            </Link>
          </Button>

          {/* Header/Profile Card */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 flex-shrink-0">
                  <User className="w-10 h-10" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {record.full_name}
                    </h2>
                    {getStatusBadge(record.status)}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 pt-1">
                    {record.community && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {record.community}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {formatEmploymentStatus(record.employment_status)}
                    </span>
                    {record.education_level && (
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        {formatEducationLevel(record.education_level)}
                      </span>
                    )}
                    {record.age && (
                      <span className="text-gray-500">{record.age} years old</span>
                    )}
                  </div>
                </div>

                {/* Status Actions */}
                {record.status === "pending" && (
                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={updatingStatus}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Approve Record</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to approve {record.full_name}
                            &apos;s record?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleStatusUpdate("approved")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          disabled={updatingStatus}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject Record</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to reject {record.full_name}
                            &apos;s record?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleStatusUpdate("rejected")}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Reject
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Key Info */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                    <UserCircle className="w-5 h-5 text-gray-500" />
                    Personal Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase">
                      Full Name
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {record.full_name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase">
                      Gender
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {record.gender
                        ? record.gender.charAt(0).toUpperCase() +
                          record.gender.slice(1)
                        : "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase">
                      National ID
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {record.national_id || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase">
                      Date of Birth
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {record.date_of_birth
                        ? new Date(record.date_of_birth).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase">
                      Phone
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {record.phone || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase">
                      Email
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {record.email || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase">
                      Hometown
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {record.hometown || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase">
                      Community
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {record.community || "-"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-gray-500" />
                    Administrative
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase">
                      Status
                    </span>
                    <div className="flex items-center gap-2">
                      {record.status === "approved" && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {record.status === "rejected" && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      {record.status === "pending" && (
                        <Clock className="w-4 h-4 text-yellow-600" />
                      )}
                      <p className="text-sm font-medium text-gray-900">
                        {record.status.charAt(0).toUpperCase() +
                          record.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase">
                      Admin Notes
                    </span>
                    <p className="text-sm text-gray-600 italic">
                      {record.admin_notes || "No notes added."}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase">
                      Created
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {record.created_at
                        ? new Date(record.created_at).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Detailed Info */}
            <div className="space-y-6 lg:col-span-2">
              {/* Education */}
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-gray-500" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase">
                      JHS Completed
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {record.jhs_completed ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase">
                      Highest Education
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {formatEducationLevel(record.education_level)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase">
                      SHS Qualification
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {record.shs_qualification || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase">
                      Degree
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {record.degree_qualification || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase">
                      Professional Certs
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {record.professional_qualification || "-"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Work Experience */}
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-500" />
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {record.work_experiences && record.work_experiences.length > 0 ? (
                    record.work_experiences.map((exp, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <p className="text-sm text-gray-700">{exp}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-sm text-gray-600">
                        No work experience listed.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills & Employment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">
                      Skills & Interests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase block mb-2">
                        Skills
                      </span>
                      {record.skills ? (
                        <div className="flex flex-wrap gap-2">
                          {record.skills.split(",").map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill.trim()}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">-</p>
                      )}
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase block mb-2">
                        Interests
                      </span>
                      <p className="text-sm text-gray-700">
                        {record.interests || "-"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">
                      Employment Prefs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500 uppercase">
                        Status
                      </span>
                      <p className="text-sm font-medium text-gray-900">
                        {formatEmploymentStatus(record.employment_status)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500 uppercase">
                        Availability
                      </span>
                      <p
                        className={`text-sm font-medium ${record.availability_status === "available" ? "text-green-600" : "text-gray-600"}`}
                      >
                        {record.availability_status === "available"
                          ? "Available"
                          : "Unavailable"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500 uppercase">
                        Preferred Location
                      </span>
                      <p className="text-sm font-medium text-gray-900">
                        {record.preferred_location || "-"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500 uppercase">
                        Expected Salary
                      </span>
                      <p className="text-sm font-medium text-gray-900">
                        {record.salary_expectation
                          ? `GHS ${Number(record.salary_expectation).toLocaleString()}`
                          : "-"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
