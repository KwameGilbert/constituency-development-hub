"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Search, 
    Plus, 
    Filter,
    Eye, 
    Edit, 
    Trash2,
    UserCircle, 
    ShieldAlert, 
    Settings2, 
    LogOut,
    Briefcase,
    GraduationCap,
    Download
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

export default function YouthPage() {
    // Mock Data
    const MOCK_YOUTH_DATA: YouthRecord[] = [
        {
            id: "YTH-2024-001",
            fullName: "Kwame Mensah",
            dateOfBirth: "1998-05-12",
            gender: "Male",
            phoneNumber: "0244123456",
            community: "East Legon",
            educationLevel: "Degree",
            employmentStatus: "Unemployed",
            skill: "Web Development",
            status: "Pending",
            registrationDate: "2024-01-15",
        },
        {
            id: "YTH-2024-002",
            fullName: "Ama Osei",
            dateOfBirth: "2000-11-23",
            gender: "Female",
            phoneNumber: "0209876543",
            community: "Madina",
            educationLevel: "SHS",
            employmentStatus: "Employed",
            skill: "Hairdressing",
            status: "Approved",
            registrationDate: "2024-02-01",
        },
        {
            id: "YTH-2024-003",
            fullName: "Kofi Boateng",
            dateOfBirth: "1995-03-08",
            gender: "Male",
            phoneNumber: "0555111222",
            community: "Adenta",
            educationLevel: "JHS",
            employmentStatus: "Employed",
            skill: "Carpentry",
            status: "Approved",
            registrationDate: "2024-02-10",
        },
        {
            id: "YTH-2024-004",
            fullName: "Abena Fosu",
            dateOfBirth: "1999-07-30",
            gender: "Female",
            phoneNumber: "0277333444",
            community: "Oyarifa",
            educationLevel: "Degree",
            employmentStatus: "Unemployed",
            skill: "Data Analysis",
            status: "Pending",
            registrationDate: "2024-03-05",
        },
        {
            id: "YTH-2024-005",
            fullName: "Yaw Darko",
            dateOfBirth: "1997-09-14",
            gender: "Male",
            phoneNumber: "0266555666",
            community: "Pantang",
            educationLevel: "Non-Formal",
            employmentStatus: "Unemployed",
            skill: "Masonry",
            status: "Pending",
            registrationDate: "2024-03-12",
        },
         {
            id: "YTH-2024-006",
            fullName: "Esi Agyemang",
            dateOfBirth: "2001-12-05",
            gender: "Female",
            phoneNumber: "0501122334",
            community: "Teiman",
            educationLevel: "Tertiary",
            employmentStatus: "Student",
            skill: "Graphic Design",
            status: "Approved",
            registrationDate: "2024-04-20",
        },
    ];

    // Calculate Stats
    const totalRecords = MOCK_YOUTH_DATA.length;
    const pending = MOCK_YOUTH_DATA.filter(r => r.status === "Pending").length;
    const approved = MOCK_YOUTH_DATA.filter(r => r.status === "Approved").length;
    const unemployed = MOCK_YOUTH_DATA.filter(r => r.employmentStatus === "Unemployed").length;


    return (
        <div className="flex flex-col h-full bg-slate-50">
            <AdminHeader 
                title="Youth Records Management" 
                description="Manage all youth records, view, edit, delete, and update employment status."
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
                    { label: "Add New Youth Record", href: "/admin-dashboard/youth/new", icon: Plus, className: "bg-red-600 hover:bg-red-700 text-white" }
                ]}
            />
            
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    
                    {/* Stats Overview */}
                    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-wrap gap-6 items-center">
                        <h2 className="text-lg font-bold text-gray-900 mr-4">Youth Records Management</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <span>Total Records: {totalRecords}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            <span className="text-gray-600">Pending: {pending}</span>
                        </div>
                         <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-gray-600">Approved: {approved}</span>
                        </div>
                         <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="w-4 h-4 text-red-500" />
                            <span className="text-gray-600">Unemployed: {unemployed}</span>
                        </div>
                        <div className="flex-1"></div>
                        <div className="flex gap-2">
                             <Button className="bg-red-600 hover:bg-red-700 text-white" asChild>
                                <Link href="/admin-dashboard/youth/new">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New Youth Record
                                </Link>
                             </Button>
                             <Button variant="outline" className="text-gray-700 border-gray-300 bg-slate-700 text-white hover:bg-slate-800 hover:text-white">
                                <Download className="w-4 h-4 mr-2" />
                                Export Records
                             </Button>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <Card className="p-4 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-4 space-y-1.5">
                                <label className="text-xs font-medium text-gray-500">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input 
                                        placeholder="Name, ID, Phone, Community" 
                                        className="pl-9 bg-gray-50 border-gray-200"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-xs font-medium text-gray-500">Status</label>
                                <Select>
                                    <SelectTrigger className="bg-gray-50 border-gray-200">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-xs font-medium text-gray-500">Employment</label>
                                <Select>
                                    <SelectTrigger className="bg-gray-50 border-gray-200">
                                        <SelectValue placeholder="All Employment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Employment</SelectItem>
                                        <SelectItem value="employed">Employed</SelectItem>
                                        <SelectItem value="unemployed">Unemployed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-3 space-y-1.5">
                                <label className="text-xs font-medium text-gray-500">Qualification</label>
                                <Select>
                                    <SelectTrigger className="bg-gray-50 border-gray-200">
                                        <SelectValue placeholder="All Qualifications" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Qualifications</SelectItem>
                                        <SelectItem value="jhs">JHS</SelectItem>
                                        <SelectItem value="shs">SHS</SelectItem>
                                        <SelectItem value="degree">Degree</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-1">
                                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
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
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Community</TableHead>
                                    <TableHead>Qualification</TableHead>
                                    <TableHead>Skill/Interest</TableHead>
                                    <TableHead>Employment</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_YOUTH_DATA.map((record) => (
                                    <TableRow key={record.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium text-xs text-gray-600">{record.id}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{record.fullName}</span>
                                                <span className="text-xs text-gray-500">{record.gender}, {new Date().getFullYear() - new Date(record.dateOfBirth).getFullYear()} yrs</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-600">{record.phoneNumber}</TableCell>
                                        <TableCell className="text-sm text-gray-600">{record.community}</TableCell>
                                        <TableCell className="text-sm text-gray-600">{record.educationLevel}</TableCell>
                                         <TableCell className="text-sm text-gray-600">{record.skill}</TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant="outline" 
                                                className={`
                                                    ${record.employmentStatus === 'Employed' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                                    ${record.employmentStatus === 'Unemployed' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                                    ${record.employmentStatus === 'Student' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                                `}
                                            >
                                                {record.employmentStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                             <Badge 
                                                variant="outline" 
                                                className={`
                                                    ${record.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                                                    ${record.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                                                `}
                                            >
                                                {record.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50" title="View Details">
                                                    <Link href={`/admin-dashboard/youth/${record.id}`}>
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50" title="Edit">
                                                      <Link href={`/admin-dashboard/youth/${record.id}/edit`}>
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Data Interface
interface YouthRecord {
    id: string;
    fullName: string;
    dateOfBirth: string; // YYYY-MM-DD
    gender: "Male" | "Female";
    phoneNumber: string;
    community: string;
    educationLevel: string;
    employmentStatus: "Employed" | "Unemployed" | "Student" | "Self-Employed";
    skill?: string;
    status: "Pending" | "Approved" | "Rejected";
    registrationDate: string;
}
