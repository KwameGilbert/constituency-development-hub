"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  ArrowLeft,
  UserCircle,
  ShieldAlert,
  Settings2,
  LogOut,
  Mail,
  Phone,
  Calendar,
  Clock,
  User,
  Key,
  Inbox,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { officersService, Officer } from "@/lib/services/officers-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function OfficerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficer = async () => {
      try {
        setLoading(true);
        const response = await officersService.getOfficer(id);
        if (response.success) {
          setOfficer(response.data.officer);
        } else {
          toast.error(response.message || "Officer not found");
          router.push("/admin-dashboard/officers");
        }
      } catch (error) {
        console.error("Failed to fetch officer", error);
        toast.error("Failed to load officer details");
        router.push("/admin-dashboard/officers");
      } finally {
        setLoading(false);
      }
    };
    fetchOfficer();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!officer) return null;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="Officer Details"
        description="View officer information and activity"
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
          { label: "Reset Password", icon: Key, href: "#" },
          {
            label: "Back to Officers",
            icon: ArrowLeft,
            href: "/admin-dashboard/officers",
          },
          {
            label: "Profile Settings",
            icon: UserCircle,
            href: "/admin-dashboard/profile",
          },
          {
            label: "Audit Logs",
            icon: ShieldAlert,
            href: "/admin-dashboard/audit",
          },
          {
            label: "System Settings",
            icon: Settings2,
            href: "/admin-dashboard/system-settings",
          },
          {
            label: "Logout",
            icon: LogOut,
            href: "#",
            className: "text-red-600 hover:text-red-700 hover:bg-red-50",
          },
        ]}
        actionButtons={[
          {
            label: "Edit Officer",
            href: `/admin-dashboard/officers/${id}/edit`,
            icon: Pencil,
            className: "bg-blue-600 hover:bg-blue-700 text-white",
          },
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Officer Profile Card */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Header */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 overflow-hidden">
                      {officer.profile_image ? (
                        <img
                          src={officer.profile_image}
                          alt={officer.user?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {officer.user?.name}
                      </h2>
                      <p className="text-gray-500">
                        {officer.title || "Officer"} &middot;{" "}
                        {officer.department || "General"}
                      </p>
                      <div className="flex gap-2 pt-1">
                        <Badge
                          variant="secondary"
                          className={`${officer.user?.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {officer.user?.status || "Unknown"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-gray-500 border-gray-200"
                        >
                          {officer.employee_id}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 pt-8 border-t border-gray-100">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {officer.user?.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span
                        className={`${officer.user?.phone ? "text-gray-700" : "text-gray-400 italic"}`}
                      >
                        {officer.user?.phone || "No phone number"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        Joined{" "}
                        {new Date(officer.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location Assignment */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    Location Assignment
                  </h3>
                  <div className="space-y-3">
                    {officer.assigned_locations &&
                    officer.assigned_locations.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {officer.assigned_locations.map((loc, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-gray-50"
                          >
                            {loc}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-500 italic">
                        No location assigned
                      </div>
                    )}
                  </div>
                  {officer.assigned_sectors &&
                    officer.assigned_sectors.length > 0 && (
                      <>
                        <h3 className="font-semibold text-gray-900 mt-4">
                          Assigned Sectors
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {officer.assigned_sectors.map((sec, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="bg-indigo-50 text-indigo-700"
                            >
                              {sec}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                </div>

                {/* Activity Statistics */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    Activity Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-indigo-50/50 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">
                        {officer.pending_reports_count || 0}
                      </div>
                      <div className="text-xs text-gray-500">
                        Pending Reports
                      </div>
                    </div>
                    {/* Mock data for others for now */}
                    <div className="text-center p-3 bg-green-50/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">-</div>
                      <div className="text-xs text-gray-500">Resolved</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2">
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold text-purple-600">
                        {officer.supervised_agents_count || 0}
                      </span>
                      <span className="text-xs text-gray-500">
                        Agents Managed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Issues Managed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Recent Issues Managed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Inbox className="w-12 h-12 mb-3 text-gray-300" />
                <p>No issues found for this officer</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
