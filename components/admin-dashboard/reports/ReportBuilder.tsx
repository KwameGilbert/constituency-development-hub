"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, FileDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function ReportBuilder() {
  const columns = [
    { id: "id", label: "ID", checked: true },
    { id: "title", label: "Title", checked: true },
    { id: "status", label: "Status", checked: true },
    { id: "severity", label: "Severity", checked: false },
    { id: "type", label: "Type", checked: false },
    { id: "category", label: "Category", checked: false },
    { id: "sector", label: "Sector", checked: false },
    { id: "subsector", label: "Subsector", checked: false },
    { id: "agent", label: "Agent", checked: false },
    { id: "officer", label: "Officer", checked: false },
    { id: "people", label: "People Affected", checked: false },
    { id: "budget", label: "Budget Estimate", checked: false },
    { id: "created", label: "Created At", checked: true },
    { id: "resolved", label: "Resolved At", checked: false },
    { id: "community", label: "Main Community", checked: false },
    { id: "smaller", label: "Smaller Community", checked: false },
    { id: "suburb", label: "Suburb", checked: false },
    { id: "cottage", label: "Cottage", checked: false },
  ];

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-100">
        <CardTitle className="text-lg font-semibold text-gray-800">Report Builder</CardTitle>
        <CardDescription>Choose data source, fields, filters, and time range. Preview before exporting.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {/* Report Type & Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           {/* Report Type */}
           <div className="lg:col-span-3 space-y-2">
             <Label htmlFor="report-type" className="text-sm font-medium text-gray-700">Report Type</Label>
             <Select defaultValue="issues">
                <SelectTrigger id="report-type" className="w-full">
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="issues">Issues</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                </SelectContent>
             </Select>
           </div>

           {/* Columns Selection */}
           <div className="lg:col-span-9 space-y-2">
             <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Columns</Label>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {columns.map((col) => (
                    <div key={col.id} className="flex items-center space-x-2">
                        <Checkbox id={col.id} defaultChecked={col.checked} className="border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                        <Label htmlFor={col.id} className="text-sm text-gray-600 font-normal cursor-pointer">{col.label}</Label>
                    </div>
                ))}
             </div>
             <div className="flex items-center gap-3 mt-2 text-xs">
                 <button className="text-red-600 font-medium hover:underline">Select all</button>
                 <button className="text-gray-500 hover:text-gray-700 hover:underline">Clear all</button>
             </div>
           </div>
        </div>

        <Separator />

        {/* Filters & Date Range */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Filters */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <Label className="text-sm font-semibold text-gray-800">Filters</Label>
                
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-gray-500">Status</Label>
                        <Select defaultValue="any">
                            <SelectTrigger className="w-full bg-white h-9">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-gray-500">Severity</Label>
                        <Select defaultValue="any">
                            <SelectTrigger className="w-full bg-white h-9">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-gray-500">Type</Label>
                        <Select defaultValue="any">
                            <SelectTrigger className="w-full bg-white h-9">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Date Range */}
             <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <Label className="text-sm font-semibold text-gray-800">Date Range</Label>
                <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">Period</Label>
                    <Select defaultValue="all">
                        <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="All time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-xs text-gray-400 pt-2">
                    Date filters apply to the record`s created_at field by default.
                </p>
             </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-3 pt-2 pb-6 px-6">
        <Button variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 gap-2">
            <FileDown className="w-4 h-4" />
            Export CSV
        </Button>
      </CardFooter>
    </Card>
  );
}
