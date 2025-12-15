"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, UserCircle, ShieldAlert, Settings2, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AddYouthPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader 
        title="Add Youth Record" 
        description="Create a new youth record with personal and professional details."
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
            { label: "Profile Settings", href: "/admin-dashboard/profile", icon: UserCircle },
            { label: "Audit Logs", href: "/admin-dashboard/audit", icon: ShieldAlert },
            { label: "System Settings", href: "/admin-dashboard/system-settings", icon: Settings2 },
            { label: "Logout", icon: LogOut, className: "text-red-600 focus:text-red-600 focus:bg-red-50" },
        ]}
        actionButtons={[
          { label: "Cancel", href: "/admin-dashboard/youth", icon: ArrowLeft, className: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm" }
        ]}
      />
      
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Page Title Card */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                     <h1 className="text-xl font-bold text-gray-900">Add New Youth Record</h1>
                     <p className="text-gray-500 text-sm flex items-center gap-1">
                        <UserCircle className="w-3 h-3" />
                        Creating new youth record
                     </p>
                </div>
                 <Button variant="outline" asChild className="border-gray-300 text-gray-700">
                    <Link href="/admin-dashboard/youth">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Cancel
                    </Link>
                </Button>
            </div>

            {/* Personal Information */}
            <Card className="border-none shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-bold text-gray-900">Personal Information</CardTitle>
                    <CardDescription>Basic details about the youth.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-gray-700">Full Name <span className="text-red-500">*</span></Label>
                            <Input id="fullName" className="bg-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob" className="text-gray-700">Date of Birth <span className="text-red-500">*</span></Label>
                            <Input id="dob" type="date" className="bg-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nationalId" className="text-gray-700">National ID Number <span className="text-red-500">*</span></Label>
                            <Input id="nationalId" className="bg-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-700">Phone Number <span className="text-red-500">*</span></Label>
                            <Input id="phone" className="bg-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hometown" className="text-gray-700">Home Town <span className="text-red-500">*</span></Label>
                            <Input id="hometown" className="bg-white" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="community" className="text-gray-700">Residential Community <span className="text-red-500">*</span></Label>
                            <Input id="community" className="bg-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Educational Qualifications */}
            <Card className="border-none shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-bold text-gray-900">Educational Qualifications</CardTitle>
                    <CardDescription>Academic achievements and certifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <Checkbox id="jhs" />
                        <label
                            htmlFor="jhs"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                        >
                            JHS Completed
                        </label>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="shs" className="text-gray-700">SHS Qualification</Label>
                            <Input id="shs" placeholder="E.g., General Arts, Science, Visual Arts, etc." className="bg-white" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="cert" className="text-gray-700">Certificate Qualification</Label>
                                <Input id="cert" className="bg-white" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="diploma" className="text-gray-700">Diploma Qualification</Label>
                                <Input id="diploma" className="bg-white" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="degree" className="text-gray-700">First Degree</Label>
                                <Input id="degree" placeholder="E.g., BSc Computer Science, BA Economics, etc." className="bg-white" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postgrad" className="text-gray-700">Postgraduate Qualification</Label>
                                <Input id="postgrad" placeholder="E.g., MSc, MBA, PhD, etc." className="bg-white" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="professional" className="text-gray-700">Professional Qualification</Label>
                            <Input id="professional" placeholder="E.g., ACCA, CIM, etc." className="bg-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Work Experience */}
            <Card className="border-none shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-bold text-gray-900">Work Experience</CardTitle>
                    <CardDescription>Previous employment history (up to 6 entries).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                        <div key={num} className="space-y-2">
                            <Label htmlFor={`work${num}`} className="text-gray-700 font-medium">Work Experience {num}</Label>
                            <Textarea 
                                id={`work${num}`} 
                                placeholder="Company name, position, duration, and key responsibilities" 
                                className="bg-white min-h-[60px] resize-y"
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Employment Information */}
            <Card className="border-none shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-bold text-gray-900">Employment Information</CardTitle>
                    <CardDescription>Current employment status and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="empStatus" className="text-gray-700">Employment Status</Label>
                            <Select defaultValue="unemployed">
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="employed">Employed</SelectItem>
                                    <SelectItem value="unemployed">Unemployed</SelectItem>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="availStatus" className="text-gray-700">Availability Status</Label>
                            <Select defaultValue="available">
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select Availability" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="unavailable">Unavailable</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currEmp" className="text-gray-700">Current Employment</Label>
                             <Input id="currEmp" placeholder="E.g., Teacher at ABC School" className="bg-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="workLoc" className="text-gray-700">Preferred Work Location</Label>
                             <Input id="workLoc" placeholder="E.g., Within constituency, Accra, etc." className="bg-white" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="salary" className="text-gray-700">Salary Expectation (GHS)</Label>
                             <Input id="salary" placeholder="Monthly salary expectation" className="bg-white" />
                        </div>
                         <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="empNotes" className="text-gray-700">Employment Notes</Label>
                             <Textarea 
                                id="empNotes" 
                                placeholder="Additional notes about employment history, preferences, etc." 
                                className="bg-white min-h-[80px]"
                            />
                        </div>
                     </div>
                </CardContent>
            </Card>

            {/* Skills and Interests */}
            <Card className="border-none shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-bold text-gray-900">Skills and Interests</CardTitle>
                    <CardDescription>Professional skills and personal interests.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="skills" className="text-gray-700">Skills</Label>
                        <Textarea 
                            id="skills" 
                            placeholder="List professional skills, technical abilities, etc." 
                            className="bg-white min-h-[80px]"
                        />
                         <p className="text-[10px] text-gray-400">Separate each skill with a comma or new line.</p>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="interests" className="text-gray-700">Interests</Label>
                        <Textarea 
                            id="interests" 
                            placeholder="List personal interests, hobbies, etc." 
                            className="bg-white min-h-[80px]"
                        />
                         <p className="text-[10px] text-gray-400">Separate each interest with a comma or new line.</p>
                    </div>
                </CardContent>
            </Card>

             {/* Administrative Information */}
            <Card className="border-none shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-bold text-gray-900">Administrative Information</CardTitle>
                    <CardDescription>Status and administrative notes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                            <Label htmlFor="adminStatus" className="text-gray-700">Status</Label>
                            <Select defaultValue="pending">
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                        <Label htmlFor="adminNotes" className="text-gray-700">Administrative Notes</Label>
                        <Textarea 
                            id="adminNotes" 
                            placeholder="Internal notes for administrators only" 
                            className="bg-white min-h-[80px]"
                        />
                         <p className="text-[10px] text-gray-400">These notes are visible only to administrators.</p>
                    </div>
                </CardContent>
            </Card>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pb-8">
                 <Button variant="outline" asChild className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Link href="/admin-dashboard/youth">Cancel</Link>
                 </Button>
                 <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-8">
                    Create Record
                 </Button>
            </div>

        </div>
      </div>
    </div>
  );
}
