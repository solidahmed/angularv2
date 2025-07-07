import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormSubmission } from '../../../../models/form.model';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss']
})
export class AnalyticsDashboardComponent implements OnInit {
  filterSubmissions(filters: any): void {
    if (this.onFilterSubmissions) {
      this.onFilterSubmissions.emit(filters);
    }
  }
  
  private calculateApprovalRates(): void {
    const totalSubmissions = this.submissions.length;
    const approvedSubmissions = this.submissions.filter(s => s.approved).length;
    const fullyApprovedSubmissions = this.submissions.filter(s => s.fullyApproved).length;
    const partiallyApprovedSubmissions = approvedSubmissions - fullyApprovedSubmissions;

    this.approvalRate = totalSubmissions > 0 ? (approvedSubmissions / totalSubmissions) * 100 : 0;
    this.fullApprovalRate = approvedSubmissions > 0 ? (fullyApprovedSubmissions / approvedSubmissions) * 100 : 0;
    this.partialApprovalRate = approvedSubmissions > 0 ? (partiallyApprovedSubmissions / approvedSubmissions) * 100 : 0;
  }
}