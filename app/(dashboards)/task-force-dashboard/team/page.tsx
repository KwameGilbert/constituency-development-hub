"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Star,
  Loader2,
} from "lucide-react";
import {
  taskForceService,
  TeamMember,
  Specialization,
} from "@/lib/services/task-force-service";

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalMembers, setTotalMembers] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch team members
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await taskForceService.getTeamMembers({
          limit: 50,
          specialization:
            specializationFilter !== "all" ? specializationFilter : undefined,
        });

        if (response.success) {
          setMembers(response.data.members);
          setTotalMembers(response.data.total);
          setSpecializations(response.data.specializations);
        }
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [specializationFilter]);

  // Filter members client-side for search and status
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Team statistics
  const teamStats = {
    totalMembers: totalMembers,
    activeMembers: members.filter((m) => m.status === "active").length,
    totalAssessments: members.reduce(
      (sum, m) => sum + m.assessments_completed,
      0,
    ),
    avgCompletionRate:
      members.length > 0
        ? Math.round(
            members.reduce((sum, m) => sum + m.completion_rate, 0) /
              members.length,
          )
        : 0,
  };

  // Top performers
  const topPerformers = [...members]
    .filter((m) => m.completed_count > 0)
    .sort((a, b) => b.completion_rate - a.completion_rate)
    .slice(0, 3);

  if (loading && members.length === 0) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Team Management</h1>
          <p className="text-slate-600 mt-1">
            Manage assessors and team performance
          </p>
        </div>
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-md shadow-slate-200/50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-indigo-100">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {teamStats.totalMembers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-slate-200/50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-emerald-100">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">
                  Active Members
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {teamStats.activeMembers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-slate-200/50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-amber-100">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">
                  Total Assessments
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {teamStats.totalAssessments}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-slate-200/50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-indigo-100">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">
                  Avg Completion
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {teamStats.avgCompletionRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search team members..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={specializationFilter}
              onValueChange={setSpecializationFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {specializations.map((spec) => (
                  <SelectItem key={spec.value} value={spec.value}>
                    {spec.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card
                key={member.id}
                className="border-none shadow-md shadow-slate-200/50 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {member.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {member.title ||
                            member.specialization ||
                            "Task Force Member"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        member.status === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-800"
                      }
                    >
                      {member.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    {member.email && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="h-4 w-4" />
                        <span>{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-4 w-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.specialization && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4" />
                        <span className="capitalize">
                          {member.specialization.replace("_", " ")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        {member.assigned_count}
                      </p>
                      <p className="text-xs text-slate-600">Assigned</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        {member.completed_count}
                      </p>
                      <p className="text-xs text-slate-600">Completed</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Completion Rate</span>
                      <span className="font-medium">
                        {Math.round(member.completion_rate)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-amber-600 h-2 rounded-full transition-all"
                        style={{ width: `${member.completion_rate}%` }}
                      ></div>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" size="sm">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {member.name} - Performance Details
                        </DialogTitle>
                        <DialogDescription>
                          Comprehensive performance metrics
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-slate-50 rounded-lg">
                            <p className="text-2xl font-bold text-slate-900">
                              {member.assigned_count}
                            </p>
                            <p className="text-sm text-slate-600">
                              Assigned Issues
                            </p>
                          </div>
                          <div className="text-center p-4 bg-slate-50 rounded-lg">
                            <p className="text-2xl font-bold text-slate-900">
                              {member.completed_count}
                            </p>
                            <p className="text-sm text-slate-600">Completed</p>
                          </div>
                          <div className="text-center p-4 bg-slate-50 rounded-lg">
                            <p className="text-2xl font-bold text-slate-900">
                              {Math.round(member.completion_rate)}%
                            </p>
                            <p className="text-sm text-slate-600">
                              Completion Rate
                            </p>
                          </div>
                          <div className="text-center p-4 bg-slate-50 rounded-lg">
                            <p className="text-2xl font-bold text-slate-900">
                              {member.assessments_completed}
                            </p>
                            <p className="text-sm text-slate-600">Assessments</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                Top Performers
              </CardTitle>
              <CardDescription>
                Team members with the highest completion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div
                    key={performer.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0
                            ? "bg-yellow-100"
                            : index === 1
                              ? "bg-gray-100"
                              : "bg-orange-100"
                        }`}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            index === 0
                              ? "text-yellow-600"
                              : index === 1
                                ? "text-gray-600"
                                : "text-orange-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {performer.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {performer.title || performer.specialization}
                        </p>
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-gray-900">
                          {Math.round(performer.completion_rate)}%
                        </p>
                        <p className="text-gray-600">Completion</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">
                          {performer.completed_count}
                        </p>
                        <p className="text-gray-600">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">
                          {performer.assessments_completed}
                        </p>
                        <p className="text-gray-600">Assessments</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Comparison</CardTitle>
              <CardDescription>
                Compare completion rates across team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members
                  .filter((m) => m.assigned_count > 0)
                  .sort((a, b) => b.completion_rate - a.completion_rate)
                  .map((member) => (
                    <div key={member.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">
                          {member.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {Math.round(member.completion_rate)}% (
                          {member.completed_count}/{member.assigned_count})
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${member.completion_rate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          {/* Assignment Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Current Assignments</CardTitle>
              <CardDescription>
                Active assignments across team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members
                  .filter((m) => m.active_count > 0)
                  .sort((a, b) => b.active_count - a.active_count)
                  .map((member) => (
                    <div
                      key={member.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Users className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {member.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {member.title || member.specialization}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {member.active_count} active
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
