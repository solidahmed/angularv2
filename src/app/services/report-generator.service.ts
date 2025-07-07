import { Injectable } from '@angular/core';
import { FormSubmission } from '@app/models/form.model';
import { ChartRendererService, ChartData } from './chart-renderer.service';

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
    submissionType: 'all' | 'vendor' | 'internal' | 'external';
    status: 'all' | 'submitted' | 'approved' | 'rejected' | 'under_review';
    riskLevel: 'all' | 'low' | 'medium' | 'high' | 'critical';
  };
  customRecommendations: string;
  format: 'pdf' | 'excel';
  includeCharts?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReportGeneratorService {
  constructor(private chartRenderer: ChartRendererService) {}

  async generateReport(submissions: FormSubmission[], config: ReportConfig): Promise<void> {
    if (config.format === 'pdf') {
      await this.generatePDF(submissions, config);
    } else {
      await this.generateExcel(submissions, config);
    }
  }

  private generateChartData(submissions: FormSubmission[], config: ReportConfig): ChartData[] {
    const charts: ChartData[] = [];

    if (config.includeSections.submissionStats) {
      const monthlyData = submissions.reduce((acc, sub) => {
        const month = new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const trendData = Object.entries(monthlyData).map(([month, count]) => ({
        name: month,
        value: count,
        submissions: count
      }));

      charts.push({
        type: config.chartTypes.submissionTrends,
        title: 'Submission Trends',
        data: trendData
      });
    }

    if (config.includeSections.riskAnalysis) {
      const riskData = submissions.reduce((acc, sub) => {
        const risk = sub.score?.riskLevel || 'unknown';
        acc[risk] = (acc[risk] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const riskChartData = Object.entries(riskData).map(([risk, count]) => ({
        name: risk.charAt(0).toUpperCase() + risk.slice(1),
        value: count
      }));

      charts.push({
        type: config.chartTypes.riskDistribution === 'donut' ? 'donut' : config.chartTypes.riskDistribution,
        title: 'Risk Distribution',
        data: riskChartData
      });
    }

    if (config.includeSections.complianceStatus) {
      const statusData = submissions.reduce((acc, sub) => {
        acc[sub.status] = (acc[sub.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const complianceChartData = Object.entries(statusData).map(([status, count]) => ({
        name: status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1),
        value: count
      }));

      charts.push({
        type: config.chartTypes.complianceStatus,
        title: 'Compliance Status',
        data: complianceChartData
      });
    }

    return charts;
  }

  private async generatePDF(submissions: FormSubmission[], config: ReportConfig): Promise<void> {
    // This would use jsPDF in a real implementation
    console.log('Generating PDF report with config:', config);
    console.log('Processing', submissions.length, 'submissions');
    
    if (config.includeCharts) {
      const chartData = this.generateChartData(submissions, config);
      console.log('Generated chart data:', chartData);
      
      // Example of rendering a chart
      if (chartData.length > 0) {
        const chartImage = await this.chartRenderer.renderChart(chartData[0]);
        console.log('Chart image generated:', chartImage.substring(0, 50) + '...');
      }
    }
    
    // In a real implementation, we would create a PDF file and download it
    alert(`PDF report "${config.title}" would be generated here with ${submissions.length} submissions`);
  }

  private async generateExcel(submissions: FormSubmission[], config: ReportConfig): Promise<void> {
    // This would use XLSX in a real implementation
    console.log('Generating Excel report with config:', config);
    console.log('Processing', submissions.length, 'submissions');
    
    // Generate summary data
    const summaryData = this.generateSummaryData(submissions);
    console.log('Summary data:', summaryData);
    
    // Generate submissions data
    const submissionsData = this.generateSubmissionsData(submissions);
    console.log('Submissions data sample:', submissionsData.slice(0, 2));
    
    // In a real implementation, we would create an Excel file and download it
    alert(`Excel report "${config.title}" would be generated here with ${submissions.length} submissions`);
  }

  private generateSummaryData(submissions: FormSubmission[]) {
    const stats = this.calculateOverallStats(submissions);
    return [
      { Metric: 'Total Submissions', Value: stats.total },
      { Metric: 'Approved Submissions', Value: stats.approved },
      { Metric: 'Approval Rate (%)', Value: stats.approvalRate },
      { Metric: 'Average Risk Score (%)', Value: stats.avgRiskScore },
    ];
  }

  private generateSubmissionsData(submissions: FormSubmission[]) {
    return submissions.map(submission => ({
      'Submission ID': submission.id,
      'Submitted By': submission.submittedBy,
      'Submitter Email': submission.submitterEmail,
      'Company': submission.companyName || 'N/A',
      'Type': submission.submissionType || 'N/A',
      'Status': submission.status,
      'Submitted At': new Date(submission.submittedAt).toLocaleDateString(),
      'Score': submission.score?.total || 'N/A',
      'Risk Level': submission.score?.riskLevel || 'N/A',
    }));
  }

  private calculateOverallStats(submissions: FormSubmission[]) {
    const total = submissions.length;
    const approved = submissions.filter(s => s.status === 'approved').length;
    const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : '0';
    
    // Calculate average risk score if available
    const submissionsWithScores = submissions.filter(s => s.score && typeof s.score === 'object');
    const avgRiskScore = submissionsWithScores.length > 0 
      ? (submissionsWithScores.reduce((sum, s) => sum + (s.score?.percentage || 0), 0) / submissionsWithScores.length).toFixed(1)
      : '0';

    return { total, approved, approvalRate, avgRiskScore };
  }

  private generateDefaultRecommendations(submissions: FormSubmission[]): string {
    const stats = this.calculateOverallStats(submissions);
    const riskDistribution = this.calculateRiskDistribution(submissions);
    
    let recommendations = "Based on the analysis of form submissions:\n\n";
    
    if (parseInt(stats.approvalRate) < 70) {
      recommendations += "• Consider reviewing approval criteria as approval rate is below 70%\n";
    }
    
    if (riskDistribution.high + riskDistribution.critical > submissions.length * 0.3) {
      recommendations += "• High risk submissions exceed 30% - implement additional screening measures\n";
    }
    
    recommendations += "• Regular monitoring and review processes should be maintained\n";
    recommendations += "• Consider automating routine compliance checks for efficiency";
    
    return recommendations;
  }

  private calculateRiskDistribution(submissions: FormSubmission[]) {
    const distribution = { critical: 0, high: 0, medium: 0, low: 0 };
    
    submissions.forEach(submission => {
      if (submission.score?.riskLevel) {
        const riskLevel = submission.score.riskLevel as keyof typeof distribution;
        if (riskLevel in distribution) {
          distribution[riskLevel]++;
        }
      }
    });

    return distribution;
  }
}