"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MessageSquare,
  ArrowUpCircle,
} from "lucide-react";
import { Idea } from "@/lib/services/ideas-service";
import { Button } from "@/components/ui/button";
import { cleanupHtml } from "@/lib/utils";

interface IdeasTableProps {
  ideas: Idea[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  onPageChange?: (page: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-100 font-bold";
    case "under_review":
      return "bg-indigo-50 text-indigo-700 border-indigo-100 font-bold";
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-100 font-bold";
    case "implemented":
      return "bg-slate-900 text-slate-50 border-slate-800 font-black";
    default:
      return "bg-slate-50 text-slate-500 border-slate-100 font-medium";
  }
};

const formatStatus = (status: string) => {
  return status.replace("_", " ").toUpperCase();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function IdeasTable({ ideas }: IdeasTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(ideas.length / pageSize);
  const paginatedIdeas = ideas.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  if (!ideas || ideas.length === 0) {
    return (
      <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl bg-white p-24 text-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
              <MessageSquare className="w-10 h-10" />
           </div>
           <p className="text-slate-400 font-bold text-lg italic tracking-tight">Registry Void: No community suggestions detected.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[30%]">
                  Strategic Concept
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Author
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Verification
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Momentum
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Declaration Date
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Oversight
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedIdeas.map((idea) => (
                <tr
                  key={idea.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <p className="font-bold text-slate-950 text-sm group-hover:text-amber-600 transition-colors truncate max-w-[280px]">
                        {idea.title}
                      </p>
                      <p className="text-xs font-medium text-slate-400 truncate max-w-[280px] mt-0.5">
                        {cleanupHtml(idea.description)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-50 border-slate-200 text-slate-500 rounded-lg">
                      {idea.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        {idea.submitter_name}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                        {idea.submitter_email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border shadow-xs ${getStatusColor(idea.status)}`}>
                      {formatStatus(idea.status)}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className="p-1 px-2.5 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-1.5 shadow-sm">
                        <ArrowUpCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-black text-amber-900">{idea.votes || 0}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
                      {formatDate(idea.created_at)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin-dashboard/ideas/${idea.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 px-4 rounded-xl bg-slate-950 text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 shadow-md shadow-slate-900/10"
                        >
                          <Eye className="w-3.5 h-3.5 mr-2 text-amber-500" />
                          Review
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white rounded-3xl shadow-md shadow-slate-200/40 border border-slate-50">
           <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Context Registry: <span className="text-slate-950">{(currentPage - 1) * pageSize + 1}</span> to <span className="text-slate-950">{Math.min(currentPage * pageSize, ideas.length)}</span> of <span className="text-slate-950">{ideas.length}</span>
            </div>
           <div className="flex items-center gap-1.5">
             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-50" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-50" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 text-xs font-black text-slate-900 bg-slate-50 rounded-lg h-9 flex items-center mx-2 tracking-widest">
              {currentPage} / {totalPages}
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-50" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-50" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
