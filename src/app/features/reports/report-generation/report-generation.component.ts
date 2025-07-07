import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormSubmission } from '../../../models/form.model';
import { SubmissionService } from '../../../services/submission.service';
import { ReportGeneratorService } from '../../../utils/report-generator.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-report-generation',
  templateUrl: './report-generation.component.html',
  styleUrls: ['./report-generation.component.scss']
})
export class ReportGenerationComponent implements OnInit {
  submissions: FormSubmission[] = [];
  reportForm: FormGroup;
  
  constructor(
    private submissionService: SubmissionService,
    private reportGenerator: ReportGeneratorService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
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

  ngOnInit(): void {
    this.loadSubmissions();
  }

  loadSubmissions(): void {
    this.submissionService.getSubmissions().subscribe(
      submissions => {
        this.submissions = submissions;
      },
      error => {
        console.error('Error loading submissions:', error);
        this.snackBar.open('Error loading submissions', 'Close', {
          duration: 3000
        });
      }
    );
  }

  generateReport(): void {
    const config = this.reportForm.value;
    
    this.snackBar.open(`Generating ${config.format.toUpperCase()} report...`, 'Close', {
      duration: 3000
    });
    
    // Generate the report
    this.reportGenerator.generateReport(this.submissions, config).then(() => {
      this.snackBar.open(`${config.format.toUpperCase()} report generated successfully`, 'Close', {
        duration: 3000
      });
    }).catch(error => {
      console.error('Error generating report:', error);
      this.snackBar.open(`Error generating report: ${error.message}`, 'Close', {
        duration: 3000
      });
    });
  }
}