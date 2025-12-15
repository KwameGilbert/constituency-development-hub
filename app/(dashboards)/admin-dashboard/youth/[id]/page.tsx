"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Pencil, 
    ArrowLeft,
    UserCircle,
    ShieldAlert,
    Settings2,
    LogOut,
    User,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Briefcase,
    Calendar,
    FileText
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function YouthDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

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
             { label: "Logout", icon: LogOut, href: "#", className: "text-red-600 hover:text-red-700 hover:bg-red-50" },
        ]}
        actionButtons={[
            { label: "Edit Record", href: `/admin-dashboard/youth/${id}/edit`, icon: Pencil, className: "bg-blue-600 hover:bg-blue-700 text-white" }
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto space-y-6">
            
            {/* Header/Profile Card */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 flex-shrink-0">
                            <User className="w-10 h-10" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-gray-900">Youth Name Placeholder</h2>
                                <Badge className="bg-yellow-100 text-yellow-700 border-none">Pending</Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 pt-1">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Community Name</span>
                                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> Unemployed</span>
                                <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> SHS Graduate</span>
                            </div>
                        </div>
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
                                <span className="text-xs text-gray-500 uppercase">Full Name</span>
                                <p className="text-sm font-medium text-gray-900">Youth Name Placeholder</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-gray-500 uppercase">National ID</span>
                                <p className="text-sm font-medium text-gray-900">GHA-123456789-0</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-gray-500 uppercase">Date of Birth</span>
                                <p className="text-sm font-medium text-gray-900">Jan 01, 2000</p>
                            </div>
                             <div className="space-y-1">
                                <span className="text-xs text-gray-500 uppercase">Phone</span>
                                <p className="text-sm font-medium text-gray-900">+233 20 000 0000</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-gray-500 uppercase">Hometown</span>
                                <p className="text-sm font-medium text-gray-900">Hometown Name</p>
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
                                <span className="text-xs text-gray-500 uppercase">Status</span>
                                <p className="text-sm font-medium text-gray-900">Pending Review</p>
                            </div>
                             <div className="space-y-1">
                                <span className="text-xs text-gray-500 uppercase">Admin Notes</span>
                                <p className="text-sm text-gray-600 italic">No notes added.</p>
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
                                <span className="text-xs text-gray-500 uppercase">JHS Completed</span>
                                <p className="text-sm font-medium text-gray-900">Yes</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-gray-500 uppercase">SHS Qualification</span>
                                <p className="text-sm font-medium text-gray-900">General Arts</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-gray-500 uppercase">Tertiary/Degree</span>
                                <p className="text-sm font-medium text-gray-900">-</p>
                            </div>
                             <div className="space-y-1">
                                <span className="text-xs text-gray-500 uppercase">Professional Certs</span>
                                <p className="text-sm font-medium text-gray-900">-</p>
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
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-sm text-gray-600">No work experience listed.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skills & Employment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg text-gray-900">Skills & Interests</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <span className="text-xs text-gray-500 uppercase block mb-2">Skills</span>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary">Communication</Badge>
                                        <Badge variant="secondary">Teamwork</Badge>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 uppercase block mb-2">Interests</span>
                                    <p className="text-sm text-gray-700">Reading, Football</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg text-gray-900">Employment Prefs</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <span className="text-xs text-gray-500 uppercase">Status</span>
                                    <p className="text-sm font-medium text-gray-900">Unemployed</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-gray-500 uppercase">Availability</span>
                                    <p className="text-sm font-medium text-green-600">Available</p>
                                </div>
                                 <div className="space-y-1">
                                    <span className="text-xs text-gray-500 uppercase">Expected Salary</span>
                                    <p className="text-sm font-medium text-gray-900">GHS 1,500</p>
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
