"use client";

import { Card } from "@/components/ui/card";
import { 
  ClipboardList, 
  Users, 
  FolderKanban, 
  Wallet, 
  Briefcase, 
  ShieldCheck, 
  UserCog
} from "lucide-react";

export function AdminMetrics() {
  return (
    <div className="space-y-6">
      {/* Top Row - Main Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="px-4 flex-row items-center border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-3 rounded-xl">
             <ClipboardList className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Issues</p>
            <h3 className="text-2xl font-bold text-gray-800">2</h3>
            <p className="text-xs text-gray-400">0 pending review</p>
          </div>
        </Card>

        <Card className="p-4 flex-row items-center space-x-4 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-emerald-100 p-3 rounded-xl">
             <Users className="text-emerald-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Users</p>
            <h3 className="text-2xl font-bold text-gray-800">3</h3>
            <p className="text-xs text-gray-400">3 total registered</p>
          </div>
        </Card>
        
        <Card className="p-4 flex-row items-center space-x-4 border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-purple-100 p-3 rounded-xl">
             <FolderKanban className="text-purple-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Projects</p>
            <h3 className="text-2xl font-bold text-gray-800">0</h3>
            <p className="text-xs text-gray-400">0 ongoing</p>
          </div>
        </Card>
        
        <Card className="p-4 flex-row items-center space-x-4 border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-amber-100 p-3 rounded-xl">
             <Wallet className="text-amber-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Budget</p>
            <h3 className="text-2xl font-bold text-gray-800">₵0</h3>
            <p className="text-xs text-gray-400">Project allocations</p>
          </div>
        </Card>
      </div>

      {/* Second Row - Entity Counts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex-row  items-center justify-between bg-blue-50 border border-blue-100 shadow-sm">
          <div>
            <p className="text-sm font-medium text-blue-800">Field Agents</p>
            <h3 className="text-2xl font-bold text-blue-900 mt-1">1</h3>
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <Users className="text-blue-600 w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex-row items-center justify-between bg-indigo-50 border border-indigo-100 shadow-sm">
          <div>
            <p className="text-sm font-medium text-indigo-800">Officers</p>
            <h3 className="text-2xl font-bold text-indigo-900 mt-1">1</h3>
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <ShieldCheck className="text-indigo-600 w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex-row items-center justify-between bg-red-50 border border-red-100 shadow-sm">
          <div>
            <p className="text-sm font-medium text-red-800">Administrators</p>
            <h3 className="text-2xl font-bold text-red-900 mt-1">1</h3>
          </div>
          {/* Typically administrators don't strictly need an icon, but we can add one for consistency */}
          <div className="bg-white p-2 rounded-lg shadow-sm hidden"> 
            <UserCog className="text-red-600 w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex-row items-center justify-between bg-green-50 border border-green-100 shadow-sm">
          <div>
            <p className="text-sm font-medium text-green-800">Job Opportunities</p>
            <h3 className="text-2xl font-bold text-green-900 mt-1">0</h3>
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <Briefcase className="text-green-600 w-5 h-5" />
          </div>
        </Card>
      </div>
    </div>
  );
}
