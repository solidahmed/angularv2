import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormSubmission } from '../../../models/form.model';
import { SubmissionService } from '../../../services/submission.service';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss']
})
export class AnalyticsDashboardComponent {
  @Input() submissions: FormSubmission[] = [];
  @Output() onFilterSubmissions = new EventEmitter<any>();
  
  selectedTimeRange: '7d' | '30d' | '90d' | '1y' = '30d';

  // Chart data
  submissionChartData: any;
  riskChartData: any;
  statusChartData: any;
  
  // Analytics metrics
  totalSubmissions = 0;
  approvedSubmissions = 0;
  rejectedSubmissions = 0;
  pendingSubmissions = 0;
  submittedSubmissions = 0;
  
  // Approval metrics
  fullyApprovedSubmissions = 0;
  partiallyApprovedSubmissions = 0;
  approvalRate = 0;
  rejectionRate = 0;
  fullApprovalRate = 0;
  
  // Risk metrics
  riskLevels: Record<string, number> = {};
  
  // Top companies
  topCompanies: any[] = [];
  
  constructor(private submissionService: SubmissionService) {}

  ngOnInit(): void {
    this.loadSubmissions();
  }

  loadSubmissions(): void {
    this.submissionService.getSubmissions().subscribe(
      submissions => {
        this.submissions = submissions;
        this.calculateMetrics();
        this.prepareChartData();
      },
      error => {
        console.error('Error loading submissions:', error);
      }
    );
  }

  calculateMetrics(): void {
    this.totalSubmissions = this.submissions.length;
    this.approvedSubmissions = this.submissions.filter(s => s.status === 'approved').length;
    this.rejectedSubmissions = this.submissions.filter(s => s.status === 'rejected').length;
    this.pendingSubmissions = this.submissions.filter(s => s.status === 'under_review').length;
    this.submittedSubmissions = this.submissions.filter(s => s.status === 'submitted').length;
    
    // Approval metrics
    this.fullyApprovedSubmissions = this.submissions.filter(s => s.status === 'approved' && s.approvalType === 'fully').length;
    this.partiallyApprovedSubmissions = this.submissions.filter(s => s.status === 'approved' && s.approvalType === 'partially').length;
    this.approvalRate = this.totalSubmissions > 0 ? (this.approvedSubmissions / this.totalSubmissions) * 100 : 0;
    this.rejectionRate = this.totalSubmissions > 0 ? (this.rejectedSubmissions / this.totalSubmissions) * 100 : 0;
    this.fullApprovalRate = this.approvedSubmissions > 0 ? (this.fullyApprovedSubmissions / this.approvedSubmissions) * 100 : 0;
    
    // Risk levels
    this.riskLevels = this.submissions.reduce((acc, sub) => {
      const risk = sub.score?.riskLevel || 'medium';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Top companies
    const companyScores = this.submissions.reduce((acc, sub) => {
      if (sub.companyName && sub.score) {
        if (!acc[sub.companyName]) {
          acc[sub.companyName] = { total: 0, count: 0, scores: [] };
        }
        acc[sub.companyName].total += sub.score.percentage;
        acc[sub.companyName].count += 1;
        acc[sub.companyName].scores.push(sub.score.percentage);
      }
      return acc;
    }, {} as Record<string, { total: number; count: number; scores: number[] }>);
    
    this.topCompanies = Object.entries(companyScores)
      .map(([company, data]) => ({
        company,
        avgScore: data.total / data.count,
        submissions: data.count,
        status: data.total / data.count >= 80 ? 'excellent' : data.total / data.count >= 60 ? 'good' : 'needs_improvement'
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 10);
  }

  prepareChartData(): void {
    // Submission trends chart
    const monthlyData = this.submissions.reduce((acc, sub) => {
      const date = new Date(sub.submittedAt);
      const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.submissions += 1;
        if (sub.status === 'approved') existing.approved += 1;
        if (sub.status === 'rejected') existing.rejected += 1;
      } else {
        acc.push({
          month,
          submissions: 1,
          approved: sub.status === 'approved' ? 1 : 0,
          rejected: sub.status === 'rejected' ? 1 : 0
        });
      }
      return acc;
    }, [] as Array<{ month: string; submissions: number; approved: number; rejected: number }>);
    
    this.submissionChartData = {
      labels: monthlyData.map(item => item.month),
      datasets: [
        {
          label: 'Submissions',
          data: monthlyData.map(item => item.submissions),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        },
        {
          label: 'Approved',
          data: monthlyData.map(item => item.approved),
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1
        },
        {
          label: 'Rejected',
          data: monthlyData.map(item => item.rejected),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1
        }
      ]
    };
    
    // Risk distribution chart
    this.riskChartData = {
      labels: Object.keys(this.riskLevels).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
      datasets: [
        {
          data: Object.values(this.riskLevels),
          backgroundColor: [
            'rgb(34, 197, 94)',  // low
            'rgb(245, 158, 11)', // medium
            'rgb(239, 68, 68)',  // high
            'rgb(220, 38, 38)'   // critical
          ]
        }
      ]
    };
    
    // Status distribution chart
    const statusData = [
      { name: 'Fully Approved', value: this.fullyApprovedSubmissions, color: '#22c55e' },
      { name: 'Partially Approved', value: this.partiallyApprovedSubmissions, color: '#84cc16' },
      { name: 'Rejected', value: this.rejectedSubmissions, color: '#ef4444' },
      { name: 'Under Review', value: this.pendingSubmissions, color: '#f59e0b' },
      { name: 'Submitted', value: this.submittedSubmissions, color: '#3b82f6' }
    ].filter(item => item.value > 0);
    
    this.statusChartData = {
      labels: statusData.map(item => item.name),
      datasets: [
        {
          data: statusData.map(item => item.value),
          backgroundColor: statusData.map(item => item.color)
        }
      ]
    };
  }

  filterByStatus(status: string): void {
    this.onFilterSubmissions.emit({ status });
  }

  filterByApprovalType(approvalType: string): void {
    this.onFilterSubmissions.emit({ approvalType });
  }
}