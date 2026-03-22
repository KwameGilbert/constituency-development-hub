// Mock Data Objects
const issuesData = {
  issues: [] as Issue[],
  statistics: {
    pendingAssessment: 0,
    underAssessment: 0,
    assessedThisMonth: 0,
    totalAssessed: 0,
    totalIssues: 0,
    approvedIssues: 0,
    rejectedIssues: 0,
    lastUpdated: new Date().toISOString(),
  } as Statistics,
};

const teamData = {
  assessors: [] as Assessor[],
  currentUser: {
    id: "user-1",
    name: "Test User",
    email: "test@example.com",
    role: "admin",
    avatar: "/avatars/default.png",
    permissions: [],
    preferences: {
      theme: "light",
      language: "en",
      notifications: { email: true, push: true, sms: false },
    },
  } as User,
};

const metadataData = {
  statuses: [
    { value: "submitted", label: "Submitted", color: "blue" },
    {
      value: "under_officer_review",
      label: "Under Officer Review",
      color: "yellow",
    },
    {
      value: "forwarded_to_admin",
      label: "Forwarded To Admin",
      color: "purple",
    },
    {
      value: "assigned_to_task_force",
      label: "Assigned To Task Force",
      color: "blue",
    },
    { value: "pending_assessment", label: "Pending Assessment", color: "blue" },
    {
      value: "assessment_in_progress",
      label: "Assessment In Progress",
      color: "orange",
    },
    {
      value: "assessment_submitted",
      label: "Assessment Submitted",
      color: "indigo",
    },
    { value: "needs_revision", label: "Needs Revision", color: "orange" },
    {
      value: "resources_allocated",
      label: "Resources Allocated",
      color: "cyan",
    },
    {
      value: "resolution_in_progress",
      label: "Resolution In Progress",
      color: "orange",
    },
    {
      value: "resolution_submitted",
      label: "Resolution Submitted",
      color: "indigo",
    },
    { value: "resolved", label: "Resolved", color: "green" },
    { value: "closed", label: "Closed", color: "green" },
    { value: "rejected", label: "Rejected", color: "red" },
  ],
  priorities: [
    { level: "low", label: "Low", color: "green" },
    { level: "medium", label: "Medium", color: "yellow" },
    { level: "high", label: "High", color: "red" },
    { level: "urgent", label: "Urgent", color: "red" },
  ],
  categories: [
    { name: "Infrastructure" },
    { name: "Health" },
    { name: "Education" },
    { name: "Environment" },
  ],
  timelines: [
    { value: "immediate", label: "Immediate (< 1 month)" },
    { value: "short_term", label: "Short Term (1-3 months)" },
    { value: "medium_term", label: "Medium Term (3-6 months)" },
    { value: "long_term", label: "Long Term (> 6 months)" },
  ],
};

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
  avatar: string;
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
  const issue = issuesData.issues.find((issue) => issue.id === id);
  return issue || null;
};

export const getIssuesByStatus = (status: string): Issue[] => {
  return issuesData.issues.filter((issue) => issue.status === status);
};

export const getIssuesByPriority = (priority: string): Issue[] => {
  return issuesData.issues.filter((issue) => issue.priority === priority);
};

export const getIssuesByCategory = (category: string): Issue[] => {
  return issuesData.issues.filter((issue) => issue.category === category);
};

export const getIssuesByAssessor = (assessorId: string): Issue[] => {
  return issuesData.issues.filter((issue) =>
    issue.assignedTo.includes(assessorId),
  );
};

export const searchIssues = (query: string): Issue[] => {
  const lowercaseQuery = query.toLowerCase();
  return issuesData.issues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(lowercaseQuery) ||
      issue.community.toLowerCase().includes(lowercaseQuery) ||
      issue.description.toLowerCase().includes(lowercaseQuery) ||
      issue.submitter.name.toLowerCase().includes(lowercaseQuery) ||
      issue.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
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
  const statusConfig = metadataData.statuses.find((s) => s.value === status);
  if (!statusConfig) return "bg-gray-100 text-gray-800 border-gray-200";

  const colorMap: { [key: string]: string } = {
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    green: "bg-green-700 text-green-100 border-green-200",
    red: "bg-red-100 text-red-800 border-red-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    gray: "bg-gray-100 text-gray-800 border-gray-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
    cyan: "bg-cyan-700 text-cyan-100 border-cyan-200",
  };

  return (
    colorMap[statusConfig.color] || "bg-gray-100 text-gray-800 border-gray-200"
  );
};

export const getPriorityColor = (priority: string): string => {
  const priorityConfig = metadataData.priorities.find(
    (p) => p.level === priority,
  );
  if (!priorityConfig) return "bg-gray-100 text-gray-800";

  const colorMap: { [key: string]: string } = {
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
  };

  return colorMap[priorityConfig.color] || "bg-gray-100 text-gray-800";
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-GB");
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("en-GB");
};

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return formatDate(dateString);
};

// Mock API functions for future backend integration
export const createAssessment = async (
  issueId: number,
  assessment: {
    decision: string;
    comments: string;
    recommendations?: string;
    estimatedBudget?: number;
    timeline?: string;
  },
): Promise<boolean> => {
  // TODO: Replace with actual API call
  console.log("Creating assessment:", { issueId, assessment });
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1000);
  });
};

export const updateIssueStatus = async (
  issueId: number,
  status: string,
): Promise<boolean> => {
  // TODO: Replace with actual API call
  console.log("Updating issue status:", { issueId, status });
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1000);
  });
};

export const uploadAttachment = async (
  issueId: number,
  file: File,
): Promise<string> => {
  // TODO: Replace with actual API call
  console.log("Uploading attachment:", { issueId, fileName: file.name });
  return new Promise((resolve) => {
    setTimeout(() => resolve(`/uploads/issues/${issueId}/${file.name}`), 1000);
  });
};
