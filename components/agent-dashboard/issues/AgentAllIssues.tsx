"use client";

import { ChevronUp, RotateCcw } from "lucide-react";
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

// Mock data for the table
const issues = [
  {
    id: 2,
    title: "aeda",
    description: "asfsd",
    category: "Health",
    status: "Rejected",
    dateSubmitted: "Oct 01, 2025",
  },
  {
    id: 1,
    title: "t6r6",
    description: "yfy",
    category: "Economic Empowerment",
    status: "Approved",
    dateSubmitted: "Sep 28, 2025",
  },
];

export function AgentAllIssues() {
  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold leading-none tracking-tight">
            Filter Issues
          </h3>
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
              placeholder="Search by title, description, or location..."
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FilterSelect label="Category" placeholder="All Categories" />
            <FilterSelect label="Status" placeholder="All Statuses" />
            <FilterSelect label="Type" placeholder="All Types" />
            <FilterSelect label="Sector" placeholder="All Sectors" />
            <FilterSelect label="Subsector" placeholder="All Subsectors" />
            <FilterSelect
              label="Main Community"
              placeholder="All Main Communities"
            />
            <FilterSelect label="Community" placeholder="All Communities" />
            <FilterSelect label="Severity" placeholder="All Severities" />
            <FilterSelect label="Agent" placeholder="All Agents" />
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>TITLE & DESCRIPTION</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>DATE SUBMITTED</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell className="font-medium">{issue.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">{issue.title}</span>
                    <span className="text-muted-foreground text-sm">
                      {issue.description}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{issue.category}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      issue.status === "Approved"
                        ? "default"
                        : issue.status === "Rejected"
                        ? "destructive"
                        : "secondary"
                    }
                    className={
                      issue.status === "Approved"
                        ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-100/80 border-0"
                        : issue.status === "Rejected"
                        ? "bg-red-100 text-red-700 hover:bg-red-100/80 border-0"
                        : "bg-orange-100 text-orange-700 hover:bg-orange-100/80 border-0"
                    }
                  >
                    {issue.status}
                  </Badge>
                </TableCell>
                <TableCell>{issue.dateSubmitted}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="link"
                    className="h-auto p-0 text-slate-600 hover:text-slate-900"
                  >
                    View
                  </Button>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-slate-600 hover:text-slate-900"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">
        {label}
      </label>
      <Select>
        <SelectTrigger className="w-full border border-slate-200 rounded-md">
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
