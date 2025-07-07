import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormSubmission, Form } from '../../../models/form.model';

@Component({
  selector: 'app-submission-card',
  templateUrl: './submission-card.component.html',
  styleUrls: ['./submission-card.component.scss']
})
export class SubmissionCardComponent {
  @Input() submission!: FormSubmission;
  @Input() form!: Form | null;
  @Input() isSelected: boolean = false;
  
  @Output() selectSubmission = new EventEmitter<FormSubmission>();
  
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
  
  getSubmitterDisplay(submission: FormSubmission): { primary: string; secondary: string; } {
    if (submission.submissionType === 'vendor') {
      return {
        primary: submission.companyName || 'Unknown Company',
        secondary: submission.submitterName || 'Unknown User'
      };
    } else if (submission.submissionType === 'external') {
      return {
        primary: submission.companyName || 'External Organization',
        secondary: submission.submitterName || 'External User'
      };
    } else {
      return {
        primary: submission.submitterName || 'Internal User',
        secondary: submission.submitterEmail
      };
    }
  }
  
  onClick(): void {
    this.selectSubmission.emit(this.submission);
  }
}