export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  defaultValue?: string | boolean | number | string[];
  placeholder?: string;
  description?: string;
  validationRegex?: string;
  errorMessage?: string;
  weightage?: number;
  
  scoring?: {
    enabled: boolean;
    maxPoints?: number;
    weightMultiplier?: number;
    correctAnswers?: string[];
    scoringCriteria?: Record<string, number>;
    requiresManualReview?: boolean;
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  };
  
  validation?: {
    message?: string;
    regex?: string;
  };
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  sector?: string | string[];
  targetAudience?: string[];
  fields: FormField[];
  preview?: string;
  riskCategories?: string[];
  scoringModel?: string;
}

export interface DocumentAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface SubmissionScore {
  total: number;
  maxTotal: number;
  percentage: number;                    // Score as a percentage (0-100)
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore?: number;
  reviewedBy: string;
  reviewedAt: Date;
  reviewComments: string;
  categoryScores?: Record<string, number>;
  breakdown?: Record<string, number>;
}

export interface EmailRecipient {
  id: string;
  email: string;
  name?: string;
  status: 'pending' | 'sent' | 'opened' | 'completed' | 'expired';
  remindersSent: number;
  sentAt?: Date;
  completedAt?: Date;
  lastReminderAt?: Date;
}

export interface FormSettings {
  allowMultipleSubmissions: boolean;
  requireLogin: boolean;
  showProgressBar: boolean;
  theme: 'light' | 'dark' | 'custom';
  customCss?: string;
  
  scoring?: {
    enabled: boolean;
    maxTotalPoints: number;
    showScoreToUser: boolean;
    passingScore: number;
    riskThresholds: {
      low: number;
      medium: number;
      high: number;
    };
  };
  
  expiration?: {
    enabled: boolean;
    expirationDate?: Date;
    message?: string;
  };
  
  emailDistribution?: {
    enabled: boolean;
    recipients: EmailRecipient[];
    reminderEnabled: boolean;
    reminderIntervalDays: number;
    maxReminders: number;
  };
  
  approval?: {
    enabled: boolean;
    requireApproval: boolean;
    approvers: string[];
    autoApproveScore?: number;
  };
  
  documents?: {
    enabled: boolean;
    allowedTypes: string[];
    maxSize: number;
    requiredDocuments: string[];
    allowUserUploads: boolean;
  };
}

export interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  settings: FormSettings;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
  submissions: number;
  
  analytics: {
    views: number;
    submissions: number;
    completionRate: number;
    emailsSent: number;
    emailsCompleted: number;
    averageCompletionTime: number;
    dropoffRate: number;
  };
}

export interface ReviewActivity {
  id: string;
  action: 'approved' | 'rejected' | 'under_review' | 'resent' | 'reminder_sent' | 'info_requested';
  comments: string;
  reviewedBy: string;
  reviewedAt: Date;
  
  metadata?: {
    reason?: string;
    urgency?: 'low' | 'medium' | 'high';
    followUpDate?: Date;
    requiredDocuments?: string[];
    specificFields?: string[];
    rejectionReason?: string;
    infoRequestType?: string;
    customInstructions?: string;
    approvalType?: 'fully' | 'partially';
  };
}

export interface FormSubmission {
  id: string;
  formId: string;
  responses: Record<string, any>;       // The actual answers to form questions
  submittedAt: Date;
  submittedBy: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  approvalType?: 'fully' | 'partially';
  score?: SubmissionScore;
  activityLog: ReviewActivity[];
  
  submitterEmail: string;
  submitterName: string;
  companyName?: string;
  recipientId?: string;
  
  submissionType: 'vendor' | 'internal' | 'external';
  
  completionPercentage?: number;
  timeSpent?: number;
  
  attachments?: DocumentAttachment[];
}