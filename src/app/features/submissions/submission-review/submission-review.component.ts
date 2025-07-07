import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormSubmission, Form } from '../../../models/form.model';
import { SubmissionService } from '../../../services/submission.service';
import { FormService } from '../../../services/form.service';

@Component({
  selector: 'app-submission-review',
  templateUrl: './submission-review.component.html',
  styleUrls: ['./submission-review.component.scss']
})
export class SubmissionReviewComponent implements OnInit {
  submissions: FormSubmission[] = [];
  filteredSubmissions: FormSubmission[] = [];
  selectedSubmission: FormSubmission | null = null;
  currentForm: Form | null = null;
  
  filterForm: FormGroup;
  showAdvancedFilters = false;
  
  constructor(
    private submissionService: SubmissionService,
    private formService: FormService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      status: ['all'],
      approvalType: [[]],
      riskLevel: [[]],
      submissionType: [[]],
      dateRange: ['all'],
      searchTerm: [''],
      company: [''],
      submitter: [''],
      sortBy: ['date'],
      sortOrder: ['desc']
    });
  }

  ngOnInit(): void {
    this.loadSubmissions();
    
    // Subscribe to filter changes
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadSubmissions(): void {
    this.submissionService.getSubmissions().subscribe(
      submissions => {
        this.submissions = submissions;
        this.filteredSubmissions = [...submissions];
        
        // Load form details for the first submission
        if (submissions.length > 0) {
          this.loadFormDetails(submissions[0].formId);
        }
      },
      error => {
        console.error('Error loading submissions:', error);
        this.snackBar.open('Error loading submissions', 'Close', {
          duration: 3000
        });
      }
    );
  }

  loadFormDetails(formId: string): void {
    this.formService.getForm(formId).subscribe(
      form => {
        this.currentForm = form;
      },
      error => {
        console.error('Error loading form details:', error);
      }
    );
  }

  selectSubmission(submission: FormSubmission): void {
    this.selectedSubmission = submission;
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    
    this.filteredSubmissions = this.submissions.filter(submission => {
      // Basic status filter
      if (filters.status !== 'all' && submission.status !== filters.status) {
        return false;
      }
      
      // Advanced filters
      if (filters.approvalType.length > 0) {
        if (submission.status !== 'approved') return false;
        if (!filters.approvalType.includes(submission.approvalType || '')) return false;
      }
      
      if (filters.riskLevel.length > 0 && !filters.riskLevel.includes(submission.score?.riskLevel || '')) {
        return false;
      }
      
      if (filters.submissionType.length > 0 && !filters.submissionType.includes(submission.submissionType)) {
        return false;
      }
      
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const companyMatch = submission.companyName?.toLowerCase().includes(searchLower);
        const submitterMatch = submission.submitterName?.toLowerCase().includes(searchLower);
        const emailMatch = submission.submitterEmail?.toLowerCase().includes(searchLower);
        
        if (!companyMatch && !submitterMatch && !emailMatch) {
          return false;
        }
      }
      
      // Company filter
      if (filters.company && !submission.companyName?.toLowerCase().includes(filters.company.toLowerCase())) {
        return false;
      }
      
      // Submitter filter
      if (filters.submitter && !submission.submitterName?.toLowerCase().includes(filters.submitter.toLowerCase())) {
        return false;
      }
      
      return true;
    });
    
    // Apply sorting
    this.sortSubmissions(filters.sortBy, filters.sortOrder);
  }

  sortSubmissions(sortBy: string, sortOrder: string): void {
    this.filteredSubmissions.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'date':
          compareValue = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
          break;
        case 'score':
          compareValue = (a.score?.percentage || 0) - (b.score?.percentage || 0);
          break;
        case 'company':
          compareValue = (a.companyName || '').localeCompare(b.companyName || '');
          break;
        case 'status':
          compareValue = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });
  }

  updateSubmission(submissionId: string, updates: Partial<FormSubmission>): void {
    this.submissionService.updateSubmission(submissionId, updates).subscribe(
      updatedSubmission => {
        // Update the submission in the list
        this.submissions = this.submissions.map(sub => 
          sub.id === submissionId ? updatedSubmission : sub
        );
        
        // Update filtered submissions
        this.applyFilters();
        
        // Update selected submission if it's the one being updated
        if (this.selectedSubmission?.id === submissionId) {
          this.selectedSubmission = updatedSubmission;
        }
        
        this.snackBar.open('Submission updated successfully', 'Close', {
          duration: 3000
        });
      },
      error => {
        console.error('Error updating submission:', error);
        this.snackBar.open('Error updating submission', 'Close', {
          duration: 3000
        });
      }
    );
  }

  clearFilters(): void {
    this.filterForm.patchValue({
      status: 'all',
      approvalType: [],
      riskLevel: [],
      submissionType: [],
      dateRange: 'all',
      searchTerm: '',
      company: '',
      submitter: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  getActiveFiltersCount(): number {
    const filters = this.filterForm.value;
    let count = 0;
    
    if (filters.status !== 'all') count++;
    if (filters.approvalType.length > 0) count++;
    if (filters.riskLevel.length > 0) count++;
    if (filters.submissionType.length > 0) count++;
    if (filters.dateRange !== 'all') count++;
    if (filters.searchTerm) count++;
    if (filters.company) count++;
    if (filters.submitter) count++;
    
    return count;
  }
}