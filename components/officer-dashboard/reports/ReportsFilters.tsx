"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Filter, RotateCcw } from "lucide-react";

export function ReportsFilters() {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-[#1e1b4b]">Report Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="dateFrom" className="text-xs text-muted-foreground">Date From</Label>
                    <Input type="date" id="dateFrom" defaultValue="2000-01-01" className="bg-white" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dateTo" className="text-xs text-muted-foreground">Date To</Label>
                    <Input type="date" id="dateTo" defaultValue="2025-12-04" className="bg-white" />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Agent</Label>
                    <Select defaultValue="all">
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Agent" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Agents</SelectItem>
                            <SelectItem value="agent1">Agent.Rock</SelectItem>
                            <SelectItem value="agent2">Agent.Paper</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Select defaultValue="all">
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Category</Label>
                    <Select defaultValue="all">
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <Button className="bg-[#312e81] hover:bg-[#312e81]/90 gap-2">
                    <Filter className="h-4 w-4" />
                    Apply Filters
                </Button>
                <Button variant="outline" className="gap-2 bg-slate-50 hover:bg-slate-100">
                    <RotateCcw className="h-4 w-4" />
                    Reset
                </Button>
            </div>
        </div>
    );
}
