"use client";

import { Card } from "@/components/ui/card";
import { 
  AlertCircle, 
  Users, 
  FolderKanban, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  UserPlus, 
  List 
} from "lucide-react";

export function AnalyticsMetrics() {
  return (
    <div className="space-y-6">
      {/* Row 1: Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Issues */}
        <Card className="p-4 flex items-center space-x-4 border-none shadow-sm bg-white">
          <div className="p-3 rounded-lg bg-red-100 text-red-600">
             <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Total Issues</p>
            <h3 className="text-2xl font-bold text-gray-800">2</h3>
          </div>
        </Card>

        {/* Active Staff */}
        <Card className="p-4 flex items-center space-x-4 border-none shadow-sm bg-white">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
             <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Active Staff</p>
            <h3 className="text-2xl font-bold text-gray-800">2</h3>
          </div>
        </Card>

        {/* Total Projects */}
        <Card className="p-4 flex items-center space-x-4 border-none shadow-sm bg-white">
          <div className="p-3 rounded-lg bg-green-100 text-green-600">
             <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Total Projects</p>
            <h3 className="text-2xl font-bold text-gray-800">0</h3>
          </div>
        </Card>

        {/* Active Budget */}
        <Card className="p-4 flex items-center space-x-4 border-none shadow-sm bg-white">
          <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
             <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Active Budget</p>
            <h3 className="text-2xl font-bold text-gray-800">₵0.00</h3>
          </div>
        </Card>
      </div>

      {/* Row 2: Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* New Issues This Week */}
        <Card className="p-4 flex items-center justify-between border-l-4 border-l-yellow-400 bg-yellow-50 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-yellow-800">New Issues This Week</p>
            <h3 className="text-2xl font-bold text-yellow-900 mt-1">0</h3>
          </div>
          <div className="p-2 bg-yellow-400 rounded-full text-white">
            <Clock className="w-4 h-4" />
          </div>
        </Card>

        {/* Resolved This Week */}
        <Card className="p-4 flex items-center justify-between border-l-4 border-l-green-400 bg-green-50 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-green-800">Resolved This Week</p>
            <h3 className="text-2xl font-bold text-green-900 mt-1">0</h3>
          </div>
          <div className="p-2 bg-green-400 rounded-full text-white">
            <CheckCircle className="w-4 h-4" />
          </div>
        </Card>

        {/* Active Users (7 days) */}
        <Card className="p-4 flex items-center justify-between border-l-4 border-l-blue-400 bg-blue-50 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-blue-800">Active Users (7 days)</p>
            <h3 className="text-2xl font-bold text-blue-900 mt-1">3</h3>
          </div>
          <div className="p-2 bg-blue-400 rounded-lg text-white">
            <UserPlus className="w-4 h-4" />
          </div>
        </Card>

        {/* Ongoing Projects */}
        <Card className="p-4 flex items-center justify-between border-l-4 border-l-purple-400 bg-purple-50 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-purple-800">Ongoing Projects</p>
            <h3 className="text-2xl font-bold text-purple-900 mt-1">0</h3>
          </div>
          <div className="p-2 bg-purple-200 text-purple-700 rounded-lg">
            <List className="w-4 h-4" />
          </div>
        </Card>
      </div>
    </div>
  );
}
