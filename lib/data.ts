import issuesData from '@/data/issues.json';
import teamData from '@/data/team.json';
import metadataData from '@/data/metadata.json';

// Types based on JSON structure
export interface Issue {
  id: number;
  title: string;
  community: string;
  status: string;
  priority: string;
  submittedBy: string;
  submittedById: string;
  submissionDate: string;
  lastUpdated: string;
  category: string;
  sector: string;
  description: string;
  detailedDescription?: string;
  location: {
    address: string;
    gps: string;
    nearestLandmark?: string;
    accessRoute?: string;
  };
  submitter: {
    name: string;
    role: string;
    phone: string;
    email: string;
    alternateContact?: string;
  };
  impactAssessment: {
    affectedPopulation: number;
    householdsAffected: number;
    estimatedCost: number;
    urgencyLevel: string;
    environmentalImpact: string;
    economicImpact: string;
    socialImpact: string;
  };
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
    uploadDate: string;
  }>;
  timeline: Array<{
    id: string;
    date: string;
    event: string;
    type: string;
    userId: string;
  }>;
  relatedIssues: number[];
  assignedTo: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  assessment?: {
    assessorId: string;
    assessorName: string;
    assessmentDate: string;
    decision: string;
    comments: string;
    recommendations: string;
    estimatedBudget: number;
    timeline: string;
  };
}

export interface Statistics {
  pendingAssessment: number;
  underAssessment: number;
  assessedThisMonth: number;
  totalAssessed: number;
  totalIssues: number;
  approvedIssues: number;
  rejectedIssues: number;
  lastUpdated: string;
}

export interface Assessor {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  specialization: string[];
  experience: string;
  location: string;
  avatar: string;
  status: string;
  totalAssessments: number;
  completedThisMonth: number;
  joinedDate: string;
  lastActive: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  permissions: string[];
  preferences: {
    theme: string;
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
}

// Data access functions
export const getIssues = (): Issue[] => {
  return issuesData.issues;
};

export const getIssueById = (id: number): Issue | null => {
  const issue = issuesData.issues.find(issue => issue.id === id);
  return issue || null;
};

export const getIssuesByStatus = (status: string): Issue[] => {
  return issuesData.issues.filter(issue => issue.status === status);
};

export const getIssuesByPriority = (priority: string): Issue[] => {
  return issuesData.issues.filter(issue => issue.priority === priority);
};

export const getIssuesByCategory = (category: string): Issue[] => {
  return issuesData.issues.filter(issue => issue.category === category);
};

export const getIssuesByAssessor = (assessorId: string): Issue[] => {
  return issuesData.issues.filter(issue => issue.assignedTo.includes(assessorId));
};

export const searchIssues = (query: string): Issue[] => {
  const lowercaseQuery = query.toLowerCase();
  return issuesData.issues.filter(issue => 
    issue.title.toLowerCase().includes(lowercaseQuery) ||
    issue.community.toLowerCase().includes(lowercaseQuery) ||
    issue.description.toLowerCase().includes(lowercaseQuery) ||
    issue.submitter.name.toLowerCase().includes(lowercaseQuery) ||
    issue.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getStatistics = (): Statistics => {
  return issuesData.statistics;
};

export const getAssessors = (): Assessor[] => {
  return teamData.assessors;
};

export const getCurrentUser = (): User => {
  return teamData.currentUser;
};

export const getMetadata = () => {
  return metadataData;
};

export const getStatusColor = (status: string): string => {
  const statusConfig = metadataData.statuses.find(s => s.value === status);
  if (!statusConfig) return 'bg-gray-100 text-gray-800 border-gray-200';
  
  const colorMap: { [key: string]: string } = {
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  
  return colorMap[statusConfig.color] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getPriorityColor = (priority: string): string => {
  const priorityConfig = metadataData.priorities.find(p => p.level === priority);
  if (!priorityConfig) return 'bg-gray-100 text-gray-800';
  
  const colorMap: { [key: string]: string } = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  };
  
  return colorMap[priorityConfig.color] || 'bg-gray-100 text-gray-800';
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateString);
};

// Mock API functions for future backend integration
export const createAssessment = async (issueId: number, assessment: {
  decision: string;
  comments: string;
  recommendations?: string;
  estimatedBudget?: number;
  timeline?: string;
}): Promise<boolean> => {
  // TODO: Replace with actual API call
  console.log('Creating assessment:', { issueId, assessment });
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 1000);
  });
};

export const updateIssueStatus = async (issueId: number, status: string): Promise<boolean> => {
  // TODO: Replace with actual API call
  console.log('Updating issue status:', { issueId, status });
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 1000);
  });
};

export const uploadAttachment = async (issueId: number, file: File): Promise<string> => {
  // TODO: Replace with actual API call
  console.log('Uploading attachment:', { issueId, fileName: file.name });
  return new Promise(resolve => {
    setTimeout(() => resolve(`/uploads/issues/${issueId}/${file.name}`), 1000);
  });
};