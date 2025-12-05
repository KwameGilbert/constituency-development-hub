'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  FileText,
  Camera,
  Download,
  MessageSquare,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  Globe,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle
} from 'lucide-react';

// Mock issue data - in real app, this would come from API based on ID
const mockIssue = {
  id: 1,
  title: 'Water Supply Issues in Akonkora Community',
  community: 'Akonkora',
  status: 'pending_assessment',
  priority: 'high',
  submittedBy: 'John Mensah',
  submissionDate: '2024-12-01',
  lastUpdated: '2024-12-03',
  category: 'Infrastructure',
  sector: 'Water & Sanitation',
  description: 'Community has been without clean water supply for over 2 weeks. The main borehole has broken down and residents are struggling to access clean water. This is affecting over 500 households in the area. Children are missing school to walk long distances to fetch water from neighboring communities. The situation is becoming dire as the dry season approaches and alternative water sources are drying up.',
  detailedDescription: 'The main borehole serving the Akonkora community was installed in 2018 and has been the primary source of clean water for over 500 households. On November 15, 2024, the submersible pump failed, leaving the entire community without access to clean water. Residents have reported that the pump made unusual noises for several days before completely failing. Local technicians attempted basic repairs but determined that the pump motor has burned out and requires replacement. The backup hand pump is also not functioning properly due to lack of maintenance.',
  location: {
    address: 'Akonkora, Sefwi Wiawso Constituency',
    gps: '5.8845° N, 2.4900° W',
    nearestLandmark: 'Akonkora Primary School',
    accessRoute: 'Main road to Sefwi Wiawso, then 3km dirt road east'
  },
  submitter: {
    name: 'John Mensah',
    role: 'Community Representative',
    phone: '+233 24 123 4567',
    email: 'john.mensah@community.gh',
    alternateContact: 'Mary Asante (+233 20 987 6543)'
  },
  impactAssessment: {
    affectedPopulation: 500,
    householdsAffected: 95,
    estimatedCost: 25000,
    urgencyLevel: 'high',
    environmentalImpact: 'medium',
    economicImpact: 'high',
    socialImpact: 'high'
  },
  attachments: [
    { name: 'broken_borehole.jpg', type: 'image', size: '2.3 MB', uploadDate: '2024-12-01' },
    { name: 'community_petition.pdf', type: 'document', size: '1.1 MB', uploadDate: '2024-12-01' },
    { name: 'technical_assessment.pdf', type: 'document', size: '856 KB', uploadDate: '2024-12-02' },
    { name: 'affected_areas_map.jpg', type: 'image', size: '3.1 MB', uploadDate: '2024-12-01' }
  ],
  timeline: [
    { date: '2024-11-15', event: 'Borehole pump failure reported', type: 'issue' },
    { date: '2024-11-20', event: 'Local technicians attempted repairs', type: 'action' },
    { date: '2024-11-25', event: 'Technical assessment completed', type: 'assessment' },
    { date: '2024-12-01', event: 'Formal issue submitted to constituency office', type: 'submission' },
    { date: '2024-12-03', event: 'Issue assigned to assessment team', type: 'assignment' }
  ],
  relatedIssues: [
    { id: 3, title: 'Water Quality Concerns in Nearby Villages', status: 'under_assessment' },
    { id: 7, title: 'Borehole Maintenance Program Request', status: 'approved' }
  ]
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending_assessment':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'under_assessment':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function IssueDetailPage() {
  const router = useRouter();
  const params = useParams();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{mockIssue.title}</h1>
            <Badge className={getStatusColor(mockIssue.status)}>
              {mockIssue.status.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
          <p className="text-gray-600">Issue #{mockIssue.id} • {mockIssue.community}</p>
        </div>
        <div className="flex gap-2">
          {mockIssue.status === 'pending_assessment' && (
            <Link href={`/task-force-dashboard/assess/${mockIssue.id}`}>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Assess Issue
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Details Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Issue Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">{mockIssue.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Category</Label>
                      <p className="font-medium">{mockIssue.category}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Sector</Label>
                      <p className="font-medium">{mockIssue.sector}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Priority</Label>
                      <Badge className={getPriorityColor(mockIssue.priority)}>
                        {mockIssue.priority.charAt(0).toUpperCase() + mockIssue.priority.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Impact Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle>Impact Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">{mockIssue.impactAssessment.affectedPopulation}</p>
                      <p className="text-xs text-gray-600">People Affected</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">{mockIssue.impactAssessment.householdsAffected}</p>
                      <p className="text-xs text-gray-600">Households</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-600">₵{mockIssue.impactAssessment.estimatedCost.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">Est. Cost</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-600 capitalize">{mockIssue.impactAssessment.urgencyLevel}</p>
                      <p className="text-xs text-gray-600">Urgency</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Social Impact</Label>
                      <p className="font-medium capitalize">{mockIssue.impactAssessment.socialImpact}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Economic Impact</Label>
                      <p className="font-medium capitalize">{mockIssue.impactAssessment.economicImpact}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Environmental Impact</Label>
                      <p className="font-medium capitalize">{mockIssue.impactAssessment.environmentalImpact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{mockIssue.detailedDescription}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Address</Label>
                    <p className="font-medium">{mockIssue.location.address}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">GPS Coordinates</Label>
                    <p className="font-medium">{mockIssue.location.gps}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Nearest Landmark</Label>
                    <p className="font-medium">{mockIssue.location.nearestLandmark}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Access Route</Label>
                    <p className="font-medium">{mockIssue.location.accessRoute}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Supporting Documents</CardTitle>
                  <CardDescription>Files and evidence provided with this issue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockIssue.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          {attachment.type === 'image' ? (
                            <Camera className="h-6 w-6 text-blue-600" />
                          ) : (
                            <FileText className="h-6 w-6 text-gray-600" />
                          )}
                          <div>
                            <p className="font-medium">{attachment.name}</p>
                            <p className="text-sm text-gray-500">
                              {attachment.size} • Uploaded {new Date(attachment.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Issue Timeline</CardTitle>
                  <CardDescription>Chronological history of this issue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockIssue.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          event.type === 'issue' ? 'bg-red-100' :
                          event.type === 'action' ? 'bg-blue-100' :
                          event.type === 'assessment' ? 'bg-yellow-100' :
                          event.type === 'submission' ? 'bg-purple-100' :
                          'bg-green-100'
                        }`}>
                          {event.type === 'issue' ? <AlertTriangle className="h-4 w-4 text-red-600" /> :
                           event.type === 'action' ? <TrendingUp className="h-4 w-4 text-blue-600" /> :
                           event.type === 'assessment' ? <FileText className="h-4 w-4 text-yellow-600" /> :
                           event.type === 'submission' ? <MessageSquare className="h-4 w-4 text-purple-600" /> :
                           <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{event.event}</p>
                          <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Submitter Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Submitted By</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-500">Name</Label>
                <p className="font-medium">{mockIssue.submitter.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Role</Label>
                <p>{mockIssue.submitter.role}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{mockIssue.submitter.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{mockIssue.submitter.email}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Alternate Contact</Label>
                <p className="text-sm">{mockIssue.submitter.alternateContact}</p>
              </div>
            </CardContent>
          </Card>

          {/* Key Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Submitted</p>
                  <p className="text-gray-600">{new Date(mockIssue.submissionDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-gray-600">{new Date(mockIssue.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockIssue.relatedIssues.map((relatedIssue) => (
                <Link 
                  key={relatedIssue.id} 
                  href={`/task-force-dashboard/issues/${relatedIssue.id}`}
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <p className="font-medium text-sm line-clamp-2">{relatedIssue.title}</p>
                  <Badge className={`mt-1 text-xs ${getStatusColor(relatedIssue.status)}`}>
                    {relatedIssue.status.replace('_', ' ')}
                  </Badge>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}