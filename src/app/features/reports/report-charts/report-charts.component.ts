import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormSubmission } from '../../../models/form.model';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-report-charts',
  templateUrl: './report-charts.component.html',
  styleUrls: ['./report-charts.component.scss']
})
export class ReportChartsComponent implements OnChanges {
  @Input() submissions: FormSubmission[] = [];
  @Input() chartType: 'bar' | 'line' | 'pie' | 'donut' = 'bar';
  @Input() dataType: 'submissionTrends' | 'riskDistribution' | 'complianceStatus' = 'submissionTrends';
  
  chartData: ChartData = { datasets: [] };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };
  
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['submissions'] || changes['chartType'] || changes['dataType']) {
      this.prepareChartData();
    }
  }

  prepareChartData(): void {
    switch (this.dataType) {
      case 'submissionTrends':
        this.prepareSubmissionTrendsData();
        break;
      case 'riskDistribution':
        this.prepareRiskDistributionData();
        break;
      case 'complianceStatus':
        this.prepareComplianceStatusData();
        break;
    }
  }

  prepareSubmissionTrendsData(): void {
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
    
    if (this.chartType === 'pie' || this.chartType === 'donut') {
      // For pie/donut, we'll show total submissions by month
      this.chartData = {
        labels: monthlyData.map(item => item.month),
        datasets: [
          {
            data: monthlyData.map(item => item.submissions),
            backgroundColor: [
              '#3b82f6', '#22c55e', '#f59e0b', '#ef4444',
              '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'
            ]
          }
        ]
      };
    } else {
      // For bar/line, we'll show submissions, approved, rejected
      this.chartData = {
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
    }
  }

  prepareRiskDistributionData(): void {
    const riskData = this.submissions.reduce((acc, sub) => {
      const risk = sub.score?.riskLevel || 'unknown';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    this.chartData = {
      labels: Object.keys(riskData).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
      datasets: [
        {
          data: Object.values(riskData),
          backgroundColor: [
            '#22c55e',  // low
            '#f59e0b',  // medium
            '#ef4444',  // high
            '#dc2626'   // critical
          ]
        }
      ]
    };
  }

  prepareComplianceStatusData(): void {
    const statusData = this.submissions.reduce((acc, sub) => {
      acc[sub.status] = (acc[sub.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    this.chartData = {
      labels: Object.keys(statusData).map(key => key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1)),
      datasets: [
        {
          data: Object.values(statusData),
          backgroundColor: [
            '#3b82f6',  // submitted
            '#f59e0b',  // under_review
            '#22c55e',  // approved
            '#ef4444'   // rejected
          ]
        }
      ]
    };
  }
  
  get chartTypeValue(): ChartType {
    if (this.chartType === 'donut') {
      return 'doughnut';
    }
    return this.chartType as ChartType;
  }
}