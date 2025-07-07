import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormSubmission } from '../../../models/form.model';

export interface ReportConfig {
  title: string;
  description: string;
  includeSections: {
    overview: boolean;
    submissionStats: boolean;
    riskAnalysis: boolean;
    complianceStatus: boolean;
    detailedResponses: boolean;
    recommendations: boolean;
  };
  chartTypes: {
    submissionTrends: 'bar' | 'line' | 'pie';
    riskDistribution: 'bar' | 'pie' | 'donut';
    complianceStatus: 'bar' | 'pie';
  };
  filterBy: {
    dateRange: { start: string; end: string };
    submissionType: 'all' | 'vendor' | 'internal';
    status: 'all' | 'submitted' | 'approved' | 'rejected' | 'under_review';
    riskLevel: 'all' | 'low' | 'medium' | 'high' | 'critical';
  };
  customRecommendations: string;
  format: 'pdf' | 'excel';
  includeCharts?: boolean;
}

@Component({
  selector: 'app-report-customization',
  templateUrl: './report-customization.component.html',
  styleUrls: ['./report-customization.component.scss']
})
export class ReportCustomizationComponent {
  @Input() submissions: FormSubmission[] = [];
  @Output() generateReport = new EventEmitter<ReportConfig>();
  
  reportForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      title: ['Vendor Risk Assessment Report'],
      description: ['Comprehensive analysis of form submissions and risk assessment'],
      includeSections: this.fb.group({
        overview: [true],
        submissionStats: [true],
        riskAnalysis: [true],
        complianceStatus: [true],
        detailedResponses: [false],
        recommendations: [true]
      }),
      chartTypes: this.fb.group({
        submissionTrends: ['bar'],
        riskDistribution: ['pie'],
        complianceStatus: ['bar']
      }),
      filterBy: this.fb.group({
        dateRange: this.fb.group({
          start: [''],
          end: ['']
        }),
        submissionType: ['all'],
        status: ['all'],
        riskLevel: ['all']
      }),
      customRecommendations: [''],
      format: ['pdf'],
      includeCharts: [true]
    });
  }
  
  onGenerateReport(): void {
    this.generateReport.emit(this.reportForm.value);
  }
}