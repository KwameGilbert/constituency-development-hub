"use client";

import React from "react";
import Link from "next/link";
import { ChevronUp, RotateCcw, Search, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for the table
const agents = [
    {
        id: 1,
        name: "Agent.Rock",
        email: "agent.rock@kofibenteh.com",
        mainCommunity: "Not Assigned",
        smallerCommunity: "Not Assigned",
        suburb: "Not Assigned",
        cottage: "Not Assigned",
        issuesStats: {
            total: 2,
            pending: 0,
            resolved: 0,
        },
        status: "Active",
        lastLogin: "Nov 30, 2025",
    },
];

export function AllAgents() {
    return (
        <div className="space-y-6">
            {/* Filter Section */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold leading-none tracking-tight">Filter Agents</h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronUp className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Search
                        </label>
                        <Input
                            placeholder="Search by name, email, or department..."
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FilterSelect label="Status" placeholder="All Statuses" />
                        <FilterSelect label="Main Community" placeholder="All Communities" />
                        <FilterSelect label="Smaller Community" placeholder="All Smaller Communities" />
                        <FilterSelect label="Suburb" placeholder="All Suburbs" />
                        <FilterSelect label="Cottage" placeholder="All Cottages" />
                        <FilterSelect label="Department" placeholder="All Departments" />
                    </div>

                    <div className="flex justify-end">
                        <Button variant="outline" className="gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Reset Filters
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                <Table className="min-w-[1200px]">
                    <TableHeader>
                        <TableRow className="text-sm">
                            <TableHead>AGENT</TableHead>
                            <TableHead>CONTACT INFO</TableHead>
                            <TableHead>MAIN COMMUNITY</TableHead>
                            <TableHead>SMALLER COMMUNITY</TableHead>
                            <TableHead>SUBURB</TableHead>
                            <TableHead>COTTAGE</TableHead>
                            <TableHead>ISSUES STATS</TableHead>
                            <TableHead>STATUS</TableHead>
                            <TableHead>LAST LOGIN</TableHead>
                            <TableHead className="text-right">ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {agents.map((agent) => (
                            <TableRow key={agent.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-5 w-5 bg-indigo-100 text-indigo-600">
                                            <AvatarFallback>
                                                <span className="font-bold">{agent.name.charAt(0)}</span>
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{agent.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{agent.email}</TableCell>
                                <TableCell className="text-muted-foreground">{agent.mainCommunity}</TableCell>
                                <TableCell className="text-muted-foreground">{agent.smallerCommunity}</TableCell>
                                <TableCell className="text-muted-foreground">{agent.suburb}</TableCell>
                                <TableCell className="text-muted-foreground">{agent.cottage}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-xs">
                                        <span className="font-medium">{agent.issuesStats.total} total</span>
                                        <span className="text-yellow-600">{agent.issuesStats.pending} pending • <span className="text-green-600">{agent.issuesStats.resolved} resolved</span></span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                                        {agent.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">{agent.lastLogin}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/officer-dashboard/agents/${agent.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/officer-dashboard/agents/${agent.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function FilterSelect({ label, placeholder }: { label: string; placeholder: string }) {
    return (
        <div className="space-y-4">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">
                {label}
            </label>
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{placeholder}</SelectItem>
                    {/* Add more options here */}
                </SelectContent>
            </Select>
        </div>
    );
}
