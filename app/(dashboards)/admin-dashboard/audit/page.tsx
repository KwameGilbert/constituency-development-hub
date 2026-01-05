"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { 
    Search,
    Download,
    Filter,
    ArrowUpDown,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

// Mock Data
const auditLogs = [
  { id: 1, user: "Admin.Rock", action: "Created User", resource: "User: john.doe", ip: "192.168.1.1", timestamp: "2023-10-27 10:30 AM", status: "success" },
  { id: 2, user: "Admin.Rock", action: "Updated Settings", resource: "System Config", ip: "192.168.1.1", timestamp: "2023-10-27 11:15 AM", status: "success" },
  { id: 3, user: "manager.kofi", action: "Login Failed", resource: "Auth Session", ip: "10.0.0.45", timestamp: "2023-10-27 09:12 AM", status: "failed" },
  { id: 4, user: "Admin.Rock", action: "Deleted Community", resource: "Community: Old Town", ip: "192.168.1.1", timestamp: "2023-10-26 04:45 PM", status: "warning" },
  { id: 5, user: "system", action: "Backup Completed", resource: "Database", ip: "localhost", timestamp: "2023-10-26 02:00 AM", status: "success" },
];

export default function AuditLogsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "success":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Success</Badge>;
            case "failed":
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
            case "warning":
                return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><AlertCircle className="w-3 h-3 mr-1" /> Warning</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <AdminHeader 
                title="Audit Logs" 
                description="Track system activities and security events"
            />

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    
                    {/* Filters */}
                    <Card className="p-4 bg-white border-gray-100 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
                                <div className="relative w-full sm:w-96">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input 
                                        placeholder="Search user, action or resource..." 
                                        className="pl-10 w-full"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Select defaultValue="all">
                                    <SelectTrigger className="w-full sm:w-40">
                                        <SelectValue placeholder="Action Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Actions</SelectItem>
                                        <SelectItem value="create">Create</SelectItem>
                                        <SelectItem value="update">Update</SelectItem>
                                        <SelectItem value="delete">Delete</SelectItem>
                                        <SelectItem value="login">Login</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <Button variant="outline" className="w-full md:w-auto">
                                    <Filter className="w-4 h-4 mr-2" />
                                    More Filters
                                </Button>
                                <Button variant="outline" className="w-full md:w-auto">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export CSV
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Table */}
                    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="w-[180px]">User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Resource</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>
                                        <div className="flex items-center space-x-1 cursor-pointer hover:text-gray-900">
                                            <span>Timestamp</span>
                                            <ArrowUpDown className="w-3 h-3" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {auditLogs.map((log) => (
                                    <TableRow key={log.id} className="hover:bg-gray-50/50 py-3">
                                        <TableCell className="font-medium text-indigo-600">{log.user}</TableCell>
                                        <TableCell>{log.action}</TableCell>
                                        <TableCell className="text-gray-500">{log.resource}</TableCell>
                                        <TableCell className="font-mono text-xs text-gray-500">{log.ip}</TableCell>
                                        <TableCell className="text-gray-500">{log.timestamp}</TableCell>
                                        <TableCell className="text-right">
                                            {getStatusBadge(log.status)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-xs text-center text-gray-500">
                            Showing {auditLogs.length} recent logs
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
