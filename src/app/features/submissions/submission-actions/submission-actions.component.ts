import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormSubmission, Form, ReviewActivity } from '@app/models/form.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-submission-actions',
  templateUrl: './submission-actions.component.html',
  styleUrls: ['./submission-actions.component.scss']
})
export class SubmissionActionsComponent implements OnInit {
  @Input() submission!: FormSubmission;
  @Input() form: Form | null = null;
  
  @Output() updateSubmission = new EventEmitter<{id: string, updates: Partial<FormSubmission>}>();
  @Output() resendForm = new EventEmitter<{id: string, comments: string}>();
  
  actionForm: FormGroup;
  actionType: 'simple' | 'advanced' = 'simple';
  
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.actionForm = this.fb.group({
      reviewComments: ['', Validators.required],
      rejectionReason: [''],
      urgencyLevel: ['medium'],
      requiredDocuments: [''],
      specificFields: [[]],
      approvalType: ['fully']
    });
  }

  ngOnInit(): void {
    // Initialize form with default values
  }

  calculateCompletionPercentage(submission: FormSubmission): number {
    if (!this.form || this.form.fields.length === 0) return 0;
    
    const requiredFields = this.form.fields.filter(field => field.required);
    if (requiredFields.length === 0) return 100;
    
    const completedRequiredFields = requiredFields.filter(field => {
      const value = submission.responses[field.id];
      return value !== null && value !== undefined && value !== '' && 
             !(Array.isArray(value) && value.length === 0);
    }).length;
    
    return Math.round((completedRequiredFields / requiredFields.length) * 100);
  }

  isFormComplete(): boolean {
    const completionPercentage = this.calculateCompletionPercentage(this.submission);
    return completionPercentage === 100 || this.submission.status === 'approved' || this.submission.status === 'under_review';
  }

  getApprovalSuggestion(submission: FormSubmission): { type: 'fully' | 'partially'; reason: string; } {
    if (!submission.score) return { type: 'fully', reason: 'No scoring data available' };
    
    const score = submission.score.percentage;
    const riskLevel = submission.score.riskLevel;
    
    if (score >= 85 && (riskLevel === 'low' || riskLevel === 'medium')) {
      return { 
        type: 'fully', 
        reason: `High score (${score}%) with ${riskLevel} risk level indicates full compliance` 
      };
    } else if (score >= 60 && score < 85) {
      return { 
        type: 'partially', 
        reason: `Moderate score (${score}%) suggests partial approval with conditions` 
      };
    } else if (score < 60 || riskLevel === 'high' || riskLevel === 'critical') {
      return { 
        type: 'partially', 
        reason: `Low score (${score}%) or ${riskLevel} risk requires conditional approval` 
      };
    }
    
    return { type: 'fully', reason: 'Standard approval criteria met' };
  }

  addActivityLog(action: ReviewActivity['action'], comments: string, metadata?: ReviewActivity['metadata']): ReviewActivity[] {
    const newActivity: ReviewActivity = {
      id: Date.now().toString(),
      action,
      comments,
      reviewedBy: 'Current User',
      reviewedAt: new Date(),
      metadata
    };

    return [...(this.submission.activityLog || []), newActivity];
  }

  handleStatusChange(status: 'approved' | 'rejected' | 'under_review'): void {
    if (!this.actionForm.get('reviewComments')?.valid) {
      this.snackBar.open('Please add comments before changing the status.', 'Close', {
        duration: 3000
      });
      return;
    }

    if (status === 'approved' && !this.actionForm.get('approvalType')?.value) {
      this.snackBar.open('Please select whether this is a full or partial approval.', 'Close', {
        duration: 3000
      });
      return;
    }

    const comments = this.actionForm.get('reviewComments')?.value;
    const approvalType = status === 'approved' ? this.actionForm.get('approvalType')?.value : undefined;
    
    const metadata: ReviewActivity['metadata'] = status === 'rejected' ? {
      reason: this.actionForm.get('rejectionReason')?.value,
      urgency: this.actionForm.get('urgencyLevel')?.value
    } : status === 'under_review' ? {
      urgency: this.actionForm.get('urgencyLevel')?.value,
      specificFields: this.actionForm.get('specificFields')?.value.length > 0 ? this.actionForm.get('specificFields')?.value : undefined,
      requiredDocuments: this.actionForm.get('requiredDocuments')?.value ? this.actionForm.get('requiredDocuments')?.value.split('\n').filter((doc: string) => doc.trim()) : undefined
    } : status === 'approved' ? {
      approvalType,
      urgency: this.actionForm.get('urgencyLevel')?.value
    } : undefined;

    const activityLog = this.addActivityLog(status, comments, metadata);

    this.updateSubmission.emit({
      id: this.submission.id,
      updates: {
        status,
        approvalType,
        activityLog,
        score: this.submission.score ? {
          ...this.submission.score,
          reviewedBy: 'Current User',
          reviewedAt: new Date(),
          reviewComments: comments
        } : undefined
      }
    });
    
    this.snackBar.open(`Submission ${status.replace('_', ' ')}`, 'Close', {
      duration: 3000
    });

    this.resetForm();
  }

  handleResendForm(): void {
    if (!this.actionForm.get('reviewComments')?.valid) {
      this.snackBar.open('Please add comments before resending the form.', 'Close', {
        duration: 3000
      });
      return;
    }

    const comments = this.actionForm.get('reviewComments')?.value;
    
    const metadata: ReviewActivity['metadata'] = {
      urgency: this.actionForm.get('urgencyLevel')?.value,
      specificFields: this.actionForm.get('specificFields')?.value.length > 0 ? this.actionForm.get('specificFields')?.value : undefined,
      requiredDocuments: this.actionForm.get('requiredDocuments')?.value ? this.actionForm.get('requiredDocuments')?.value.split('\n').filter((doc: string) => doc.trim()) : undefined
    };

    const activityLog = this.addActivityLog('resent', comments, metadata);

    this.resendForm.emit({ id: this.submission.id, comments });
    
    this.updateSubmission.emit({
      id: this.submission.id,
      updates: { 
        status: 'under_review',
        activityLog
      }
    });
    
    this.snackBar.open('Form resent to the user with your comments.', 'Close', {
      duration: 3000
    });

    this.resetForm();
  }

  handleSendReminder(): void {
    if (!this.actionForm.get('reviewComments')?.valid) {
      this.snackBar.open('Please add a reminder message.', 'Close', {
        duration: 3000
      });
      return;
    }

    const comments = this.actionForm.get('reviewComments')?.value;
    
    const activityLog = this.addActivityLog('reminder_sent', comments, { 
      urgency: this.actionForm.get('urgencyLevel')?.value 
    });
    
    this.updateSubmission.emit({
      id: this.submission.id,
      updates: { activityLog }
    });

    this.snackBar.open('A reminder email has been sent to complete the form.', 'Close', {
      duration: 3000
    });

    this.resetForm();
  }

  resetForm(): void {
    this.actionForm.patchValue({
      reviewComments: '',
      rejectionReason: '',
      urgencyLevel: 'medium',
      requiredDocuments: '',
      specificFields: [],
      approvalType: 'fully'
    });
    
    this.actionType = 'simple';
  }

  applyAISuggestion(): void {
    const suggestion = this.getApprovalSuggestion(this.submission);
    this.actionForm.patchValue({
      approvalType: suggestion.type
    });
  }
}