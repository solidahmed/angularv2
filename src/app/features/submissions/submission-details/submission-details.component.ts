import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormSubmission, Form, DocumentAttachment } from '../../../models/form.model';

@Component({
  selector: 'app-submission-details',
  templateUrl: './submission-details.component.html',
  styleUrls: ['./submission-details.component.scss']
})
export class SubmissionDetailsComponent implements OnChanges {
  @Input() submission!: FormSubmission;
  @Input() form: Form | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    // Handle changes if needed
  }
  
  downloadFile(attachment: DocumentAttachment): void {
    // Implementation for file download
  }
  
  calculateCompletionPercentage(submission: FormSubmission): number {
    if (!this.form || this.form.fields.length === 0) return 0;
    
    // If approved or under review, show 100% completion
    if (submission.status === 'approved' || submission.status === 'under_review') {
      return 100;
    }
    
    const requiredFields = this.form.fields.filter(field => field.required);
    if (requiredFields.length === 0) return 100;
    
    const completedRequiredFields = requiredFields.filter(field => {
      const value = submission.responses[field.id];
      return value !== null && value !== undefined && value !== '' && 
             !(Array.isArray(value) && value.length === 0);
    }).length;
    
    return Math.round((completedRequiredFields / requiredFields.length) * 100);
  }
  
  getCompletionStatus(submission: FormSubmission): string {
    const percentage = this.calculateCompletionPercentage(submission);
    
    if (submission.status === 'approved') return 'Completed';
    if (submission.status === 'under_review') return 'Under Processing';
    if (percentage < 100) return 'Not Completed';
    return 'Completed';
  }
  
  getStatusColor(status: string, completionPercentage: number): string {
    if (completionPercentage < 100 && status === 'submitted') {
      return 'orange';
    }
    
    switch (status) {
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'under_review': return 'yellow';
      default: return 'gray';
    }
  }
  
  getSubmitterDisplay(submission: FormSubmission): { name: string; email: string; company: string; type: string; } {
    if (submission.submissionType === 'vendor') {
      return {
        name: submission.submitterName || 'Unknown User',
        email: submission.submitterEmail,
        company: submission.companyName || 'Unknown Company',
        type: 'Vendor Submission'
      };
    } else if (submission.submissionType === 'external') {
      return {
        name: submission.submitterName || 'External User',
        email: submission.submitterEmail,
        company: submission.companyName || 'External Organization',
        type: 'External Submission'
      };
    } else {
      return {
        name: submission.submitterName || 'Internal User',
        email: submission.submitterEmail,
        company: 'Internal',
        type: 'Internal Submission'
      };
    }
  }
  
  hasResponse(response: any): boolean {
    return response !== null && response !== undefined && response !== '' && 
           !(Array.isArray(response) && response.length === 0);
  }
  
  formatResponse(response: any): string {
    if (Array.isArray(response)) {
      return response.join(', ');
    } else if (typeof response === 'object') {
      return JSON.stringify(response, null, 2);
    } else {
      return String(response);
    }
  }
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}