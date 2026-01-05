"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { 
    Building, 
    Home, 
    MapPin, 
    UserCircle, 
    ShieldAlert, 
    Settings2, 
    LogOut,
    Map as MapIcon
} from "lucide-react";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { LocationHierarchy } from "@/components/admin-dashboard/LocationHierarchy";

export default function LocationsPage() {
    // Metrics Data
    const metrics = [
        {
            label: "Total Locations",
            count: 5,
            icon: MapIcon,
            color: "text-indigo-600",
            bgColor: "bg-indigo-100"
        },
        {
            label: "Communities",
            count: 4,
            icon: Building,
            color: "text-indigo-600",
            bgColor: "bg-indigo-100"
        },
        {
            label: "Smaller Communities",
            count: 0,
            icon: Home,
            color: "text-blue-600",
            bgColor: "bg-blue-100"
        },
        {
            label: "Suburbs",
            count: 1,
            icon: MapPin,
            color: "text-green-600",
            bgColor: "bg-green-100"
        },
        {
            label: "Cottages",
            count: 0,
            icon: Home,
            color: "text-amber-600",
            bgColor: "bg-amber-100"
        }
    ];

    // Manage Locations Data
    const manageLocations = [
        {
            title: "Communities",
            description: "Manage main communities",
            icon: Building,
            color: "bg-indigo-600",
            bgColor: "bg-indigo-50",
            href: "/admin-dashboard/locations/communities"
        },
        {
            title: "Smaller Communities",
            description: "Manage smaller communities",
            icon: Home,
            color: "bg-blue-600",
            bgColor: "bg-blue-50",
            href: "/admin-dashboard/locations/smaller-communities"
        },
        {
            title: "Suburbs",
            description: "Manage suburb locations",
            icon: MapPin,
            color: "bg-green-600",
            bgColor: "bg-green-50",
            href: "/admin-dashboard/locations/suburbs"
        },
        {
            title: "Cottages",
            description: "Manage cottage locations",
            icon: Home,
            color: "bg-amber-600",
            bgColor: "bg-amber-50",
            href: "/admin-dashboard/locations/cottages"
        }
    ];

    // Recent Locations Data
    const recentLocations = [
        { id: 1, name: "Sefwi Asafo", type: "Suburb", date: "Sep 28, 2025" },
        { id: 2, name: "Sefwi Boako", type: "Community", date: "Sep 28, 2025" },
        { id: 3, name: "Sefwi Dwenase", type: "Community", date: "Sep 28, 2025" },
        { id: 4, name: "Sefwi Wiawso", type: "Community", date: "Sep 28, 2025" },
        { id: 5, name: "Sefwi Asawinso", type: "Community", date: "Sep 28, 2025" },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <AdminHeader 
                title="Location Management" 
                description="Manage all geographical locations in the system"
                roleAbbr="MP"
                userName="Admin.Rock"
                userRoleLabel="MP"
                dropdownItems={[
                    { label: "Smaller Communities", href: "/admin-dashboard/locations/smaller-communities", icon: Home },
                    { label: "Suburbs", href: "/admin-dashboard/locations/suburbs", icon: MapPin },
                    { label: "Cottages", href: "/admin-dashboard/locations/cottages", icon: Home },
                    { label: "Profile Settings", href: "/admin-dashboard/profile", icon: UserCircle },
                    { label: "Audit Logs", href: "/admin-dashboard/audit", icon: ShieldAlert },
                    { label: "System Settings", href: "/admin-dashboard/system-settings", icon: Settings2 },
                    { label: "Logout", icon: LogOut, className: "text-red-600 focus:text-red-600 focus:bg-red-50" },
                ]}
                actionButtons={[
                    { label: "Communities", href: "/admin-dashboard/locations/communities", icon: Building, className: "bg-indigo-600 hover:bg-indigo-700 text-white" }
                ]}
            />
            
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    
                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {metrics.map((metric, index) => (
                            <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{metric.count}</h3>
                                </div>
                                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Manage Locations */}
                        <Card className="p-6 bg-white border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Manage Locations</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {manageLocations.map((item, index) => (
                                    <Link key={index} href={item.href}>
                                        <div className={`
                                            group relative overflow-hidden rounded-xl border p-4 transition-all hover:bg-white hover:shadow-md
                                            ${item.bgColor} border-transparent
                                        `}>
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-lg ${item.color} text-white`}>
                                                    <item.icon className="w-6 h-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                                    <p className="text-xs text-gray-500">{item.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </Card>

                        {/* Recent Locations */}
                        <Card className="p-6 bg-white border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Recently Added Locations</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[40%]">Location</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right">Added</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentLocations.map((location) => (
                                        <TableRow key={location.id} className="hover:bg-gray-50 border-gray-50">
                                            <TableCell className="font-medium text-gray-900">{location.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={`
                                                    ${location.type === 'Suburb' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                                                    ${location.type === 'Community' ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100' : ''}
                                                `}>
                                                    {location.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-gray-500 text-sm">{location.date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>

                    {/* Location Hierarchy */}
                    <div className="w-full">
                        <LocationHierarchy />
                    </div>
                </div>
            </div>
        </div>
    );
}
