'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  TrendingUp,
  Award
} from 'lucide-react';
import { getAssessors, getIssues, getMetadata } from '@/lib/data';

export default function TeamPage() {
  const assessors = getAssessors();
  const issues = getIssues();
  const metadata = getMetadata();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAssessor, setSelectedAssessor] = useState<any>(null);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    specialization: [],
    location: ''
  });

  // Calculate performance metrics for each assessor
  const assessorStats = assessors.map(assessor => {
    const assignedIssues = issues.filter(issue => issue.assignedTo.includes(assessor.id));
    const completedIssues = assignedIssues.filter(issue => 
      issue.status === 'approved' || issue.status === 'rejected'
    );
    const approvedIssues = assignedIssues.filter(issue => issue.status === 'approved');
    
    // Calculate average assessment time
    const assessmentTimes = completedIssues
      .filter(issue => issue.timeline && issue.timeline.length >= 2)
      .map(issue => {
        const start = new Date(issue.timeline[0].date);
        const end = new Date(issue.timeline[issue.timeline.length - 1].date);
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      });
    
    const avgAssessmentTime = assessmentTimes.length > 0 
      ? Math.round(assessmentTimes.reduce((a, b) => a + b, 0) / assessmentTimes.length)
      : 0;

    return {
      ...assessor,
      assignedCount: assignedIssues.length,
      completedCount: completedIssues.length,
      approvedCount: approvedIssues.length,
      completionRate: assignedIssues.length > 0 ? (completedIssues.length / assignedIssues.length) * 100 : 0,
      approvalRate: completedIssues.length > 0 ? (approvedIssues.length / completedIssues.length) * 100 : 0,
      avgAssessmentTime
    };
  });

  // Filter assessors
  const filteredAssessors = assessorStats.filter(assessor => {
    const matchesSearch = assessor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || assessor.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || assessor.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get unique roles for filter
  const roles = [...new Set(assessors.map(assessor => assessor.role))];

  // Team statistics
  const teamStats = {
    totalMembers: assessors.length,
    activeMembers: assessors.filter(a => a.status === 'active').length,
    totalAssignments: assessorStats.reduce((sum, a) => sum + a.assignedCount, 0),
    avgCompletionRate: assessorStats.length > 0 
      ? Math.round(assessorStats.reduce((sum, a) => sum + a.completionRate, 0) / assessorStats.length)
      : 0
  };

  // Top performers
  const topPerformers = assessorStats
    .filter(a => a.completedCount > 0)
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 3);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-1">Manage assessors and team performance</p>
        </div>
        <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
              <DialogDescription>
                Add a new assessor to the team
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input
                  id="phone"
                  value={newMember.phone}
                  onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                <Select value={newMember.role} onValueChange={(value) => setNewMember(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Senior Assessor">Senior Assessor</SelectItem>
                    <SelectItem value="Assessor">Assessor</SelectItem>
                    <SelectItem value="Junior Assessor">Junior Assessor</SelectItem>
                    <SelectItem value="Technical Advisor">Technical Advisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input
                  id="location"
                  value={newMember.location}
                  onChange={(e) => setNewMember(prev => ({ ...prev, location: e.target.value }))}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  console.log('Adding new member:', newMember);
                  setShowAddMemberDialog(false);
                  setNewMember({ name: '', email: '', phone: '', role: '', specialization: [], location: '' });
                }}
              >
                Add Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{teamStats.totalMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">{teamStats.activeMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{teamStats.totalAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Completion</p>
                <p className="text-2xl font-bold text-gray-900">{teamStats.avgCompletionRate}%</p>
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search team members..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
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
            {filteredAssessors.map((assessor) => (
              <Card key={assessor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{assessor.name}</h3>
                        <p className="text-sm text-gray-600">{assessor.role}</p>
                      </div>
                    </div>
                    <Badge 
                      className={
                        assessor.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {assessor.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{assessor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{assessor.phone}</span>
                    </div>
                    {assessor.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{assessor.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{assessor.assignedCount}</p>
                      <p className="text-xs text-gray-600">Assigned</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{assessor.completedCount}</p>
                      <p className="text-xs text-gray-600">Completed</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-medium">{Math.round(assessor.completionRate)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${assessor.completionRate}%` }}
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
                        <DialogTitle>{assessor.name} - Performance Details</DialogTitle>
                        <DialogDescription>
                          Comprehensive performance metrics and assignment history
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Performance Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-gray-900">{assessor.assignedCount}</p>
                            <p className="text-sm text-gray-600">Assigned Issues</p>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-gray-900">{assessor.completedCount}</p>
                            <p className="text-sm text-gray-600">Completed</p>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-gray-900">{Math.round(assessor.completionRate)}%</p>
                            <p className="text-sm text-gray-600">Completion Rate</p>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-gray-900">{assessor.avgAssessmentTime}</p>
                            <p className="text-sm text-gray-600">Avg Days</p>
                          </div>
                        </div>

                        {/* Recent Assignments */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Recent Assignments</h4>
                          <div className="space-y-2">
                            {issues
                              .filter(issue => issue.assignedTo.includes(assessor.id))
                              .slice(0, 5)
                              .map(issue => (
                                <div key={issue.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div>
                                    <p className="font-medium text-gray-900">{issue.title}</p>
                                    <p className="text-sm text-gray-600">{issue.community}</p>
                                  </div>
                                  <Badge variant="outline">
                                    {issue.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                              ))}
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
                  <div key={performer.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-100' : 
                        index === 1 ? 'bg-gray-100' : 'bg-orange-100'
                      }`}>
                        <Star className={`h-4 w-4 ${
                          index === 0 ? 'text-yellow-600' : 
                          index === 1 ? 'text-gray-600' : 'text-orange-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{performer.name}</h4>
                        <p className="text-sm text-gray-600">{performer.role}</p>
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-gray-900">{Math.round(performer.completionRate)}%</p>
                        <p className="text-gray-600">Completion</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">{performer.completedCount}</p>
                        <p className="text-gray-600">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">{performer.avgAssessmentTime}</p>
                        <p className="text-gray-600">Avg Days</p>
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
              <CardDescription>Compare completion rates across team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessorStats
                  .filter(a => a.assignedCount > 0)
                  .sort((a, b) => b.completionRate - a.completionRate)
                  .map((assessor) => (
                    <div key={assessor.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{assessor.name}</span>
                        <span className="text-sm text-gray-600">
                          {Math.round(assessor.completionRate)}% ({assessor.completedCount}/{assessor.assignedCount})
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${assessor.completionRate}%` }}
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
              <CardDescription>Active assignments across team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessorStats
                  .filter(a => a.assignedCount > 0)
                  .sort((a, b) => b.assignedCount - a.assignedCount)
                  .map((assessor) => {
                    const activeAssignments = issues.filter(issue => 
                      issue.assignedTo.includes(assessor.id) && 
                      !['approved', 'rejected'].includes(issue.status)
                    );
                    
                    return (
                      <div key={assessor.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <Users className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{assessor.name}</h4>
                              <p className="text-sm text-gray-600">{assessor.role}</p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {activeAssignments.length} active
                          </Badge>
                        </div>
                        
                        {activeAssignments.length > 0 && (
                          <div className="space-y-2">
                            {activeAssignments.slice(0, 3).map(issue => (
                              <div key={issue.id} className="flex items-center justify-between text-sm">
                                <span className="text-gray-900">{issue.title}</span>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {issue.priority === 'high' ? 'High' : 
                                     issue.priority === 'medium' ? 'Medium' : 'Low'}
                                  </Badge>
                                  <span className="text-gray-600">
                                    {new Date(issue.submissionDate).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {activeAssignments.length > 3 && (
                              <p className="text-xs text-gray-500">
                                +{activeAssignments.length - 3} more assignments
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}