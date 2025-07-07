import { Injectable } from '@angular/core';
import { FormSubmission } from '../models/form.model';
import { ChartRendererService, ChartOptions } from './chart-renderer.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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
  
  private async generatePDF(submissions: FormSubmission[], config: ReportConfig): Promise<void> {
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Title and description
    doc.setFontSize(20);
    doc.text(config.title, 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(12);
    doc.text(config.description, 20, yPosition);
    yPosition += 20;
    
    // Generate and add charts if enabled
    if (config.includeCharts) {
      const chartOptions = this.generateChartOptions(submissions, config);
      
      for (const options of chartOptions) {
        // Check if we need a new page
        if (yPosition > 200) {
          doc.addPage();
          yPosition = 20;
        }
        
        try {
          // Create a temporary canvas
          const canvas = document.createElement('canvas');
          canvas.width = 600;
          canvas.height = 400;
          
          // Render chart to canvas
          await this.chartRenderer.renderChart(canvas, options);
          
          // Add chart title
          doc.setFontSize(16);
          doc.text(options.title, 20, yPosition);
          yPosition += 15;
          
          // Add chart image to PDF
          const imgData = await this.chartRenderer.exportChartAsImage(canvas);
          doc.addImage(imgData, 'PNG', 20, yPosition, 170, 100);
          yPosition += 110;
        } catch (error) {
          console.error(`Error rendering chart ${options.title}:`, error);
          // Add error message instead of chart
          doc.setFontSize(12);
          doc.text(`Chart: ${options.title} (Error generating chart)`, 20, yPosition);
          yPosition += 20;
        }
        
        yPosition += 10;
      }
    }
    
    // Generate each section based on configuration
    if (config.includeSections.overview) {
      yPosition = this.addOverviewSection(doc, submissions, yPosition);
    }
    
    if (config.includeSections.submissionStats) {
      yPosition = this.addSubmissionStatsSection(doc, submissions, yPosition);
    }
    
    if (config.includeSections.riskAnalysis) {
      yPosition = this.addRiskAnalysisSection(doc, submissions, yPosition);
    }
    
    if (config.includeSections.complianceStatus) {
      yPosition = this.addComplianceSection(doc, submissions, yPosition);
    }
    
    if (config.includeSections.detailedResponses) {
      yPosition = this.addDetailedResponsesSection(doc, submissions, yPosition);
    }
    
    if (config.includeSections.recommendations) {
      yPosition = this.addRecommendationsSection(doc, config, yPosition);
    }
    
    // Save the PDF
    doc.save(`${config.title.replace(/\s+/g, '_')}.pdf`);
  }
  
  private async generateExcel(submissions: FormSubmission[], config: ReportConfig): Promise<void> {
    const workbook = XLSX.utils.book_new();
    
    // Summary worksheet
    const summaryData = this.generateSummaryData(submissions);
    const summaryWS = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWS, "Summary");
    
    // Submissions worksheet
    const submissionsData = this.generateSubmissionsData(submissions);
    const submissionsWS = XLSX.utils.json_to_sheet(submissionsData);
    XLSX.utils.book_append_sheet(workbook, submissionsWS, "Submissions");
    
    // Risk analysis worksheet
    if (config.includeSections.riskAnalysis) {
      const riskData = this.generateRiskData(submissions);
      const riskWS = XLSX.utils.json_to_sheet(riskData);
      XLSX.utils.book_append_sheet(workbook, riskWS, "Risk Analysis");
    }
    
    // Save the Excel file
    XLSX.writeFile(workbook, `${config.title.replace(/\s+/g, '_')}.xlsx`);
  }
  
  private generateChartOptions(submissions: FormSubmission[], config: ReportConfig): ChartOptions[] {
    const chartOptions: ChartOptions[] = [];
    
    if (config.includeSections.submissionTrends) {
      const monthlyData = submissions.reduce((acc, sub) => {
        const month = new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const trendData = Object.entries(monthlyData).map(([month, count]) => ({
        name: month,
        value: count
      }));
      
      chartOptions.push({
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
      
      chartOptions.push({
        type: config.chartTypes.riskDistribution === 'donut' ? 'doughnut' : config.chartTypes.riskDistribution,
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
      
      chartOptions.push({
        type: config.chartTypes.complianceStatus,
        title: 'Compliance Status',
        data: complianceChartData
      });
    }
    
    return chartOptions;
  }
  
  private addOverviewSection(doc: jsPDF, submissions: FormSubmission[], yPosition: number): number {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.text("Executive Overview", 20, yPosition);
    yPosition += 15;
    
    const stats = this.calculateOverallStats(submissions);
    doc.setFontSize(12);
    doc.text(`Total Submissions: ${stats.total}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Approval Rate: ${stats.approvalRate}%`, 20, yPosition);
    yPosition += 8;
    doc.text(`Average Risk Score: ${stats.avgRiskScore}%`, 20, yPosition);
    yPosition += 20;
    
    return yPosition;
  }
  
  private addSubmissionStatsSection(doc: jsPDF, submissions: FormSubmission[], yPosition: number): number {
    // Check if we need a new page
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.text("Submission Statistics", 20, yPosition);
    yPosition += 15;
    
    const statsData = [
      ['Metric', 'Value'],
      ['Total Submissions', submissions.length.toString()],
      ['Approved', submissions.filter(s => s.status === 'approved').length.toString()],
      ['Under Review', submissions.filter(s => s.status === 'under_review').length.toString()],
      ['Rejected', submissions.filter(s => s.status === 'rejected').length.toString()],
    ];
    
    autoTable(doc, {
      head: [statsData[0]],
      body: statsData.slice(1),
      startY: yPosition,
      margin: { left: 20 },
    });
    
    return (doc as any).lastAutoTable.finalY + 20;
  }
  
  private addRiskAnalysisSection(doc: jsPDF, submissions: FormSubmission[], yPosition: number): number {
    // Check if we need a new page
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.text("Risk Analysis", 20, yPosition);
    yPosition += 15;
    
    const riskData = this.calculateRiskDistribution(submissions);
    const riskTableData = [
      ['Risk Level', 'Count', 'Percentage'],
      ['Critical', riskData.critical.toString(), `${((riskData.critical / submissions.length) * 100).toFixed(1)}%`],
      ['High', riskData.high.toString(), `${((riskData.high / submissions.length) * 100).toFixed(1)}%`],
      ['Medium', riskData.medium.toString(), `${((riskData.medium / submissions.length) * 100).toFixed(1)}%`],
      ['Low', riskData.low.toString(), `${((riskData.low / submissions.length) * 100).toFixed(1)}%`],
    ];
    
    autoTable(doc, {
      head: [riskTableData[0]],
      body: riskTableData.slice(1),
      startY: yPosition,
      margin: { left: 20 },
    });
    
    return (doc as any).lastAutoTable.finalY + 20;
  }
  
  private addComplianceSection(doc: jsPDF, submissions: FormSubmission[], yPosition: number): number {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.text("Compliance Status", 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(12);
    const complianceRate = (submissions.filter(s => s.status === 'approved').length / submissions.length * 100).toFixed(1);
    doc.text(`Overall Compliance Rate: ${complianceRate}%`, 20, yPosition);
    yPosition += 20;
    
    return yPosition;
  }
  
  private addDetailedResponsesSection(doc: jsPDF, submissions: FormSubmission[], yPosition: number): number {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.text("Detailed Responses", 20, yPosition);
    yPosition += 15;
    
    // Add a summary of responses
    doc.setFontSize(12);
    doc.text("This section contains detailed submission data available in Excel format.", 20, yPosition);
    yPosition += 20;
    
    return yPosition;
  }
  
  private addRecommendationsSection(doc: jsPDF, config: ReportConfig, yPosition: number): number {
    // Check if we need a new page
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.text("Recommendations", 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(12);
    const recommendations = config.customRecommendations || "No custom recommendations provided.";
    const lines = doc.splitTextToSize(recommendations, 170);
    doc.text(lines, 20, yPosition);
    
    return yPosition + (lines.length * 8) + 20;
  }
  
  private calculateOverallStats(submissions: FormSubmission[]) {
    const total = submissions.length;
    const approved = submissions.filter(s => s.status === 'approved').length;
    const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : '0';
    
    // Calculate average risk score if available
    const submissionsWithScores = submissions.filter(s => s.score && typeof s.score === 'object');
    const avgRiskScore = submissionsWithScores.length > 0 
      ? (submissionsWithScores.reduce((sum, s) => sum + ((s.score as any)?.percentage || 0), 0) / submissionsWithScores.length).toFixed(1)
      : '0';
    
    return { total, approved, approvalRate, avgRiskScore };
  }
  
  private calculateRiskDistribution(submissions: FormSubmission[]) {
    const distribution = { critical: 0, high: 0, medium: 0, low: 0 };
    
    submissions.forEach(submission => {
      if (submission.score && typeof submission.score === 'object') {
        const riskLevel = (submission.score as any)?.riskLevel;
        if (riskLevel && distribution.hasOwnProperty(riskLevel)) {
          distribution[riskLevel as keyof typeof distribution]++;
        }
      }
    });
    
    return distribution;
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
      'Company': (submission as any).companyName || 'N/A',
      'Type': (submission as any).submissionType || 'N/A',
      'Status': submission.status,
      'Submitted At': submission.submittedAt.toLocaleDateString(),
      'Score': typeof submission.score === 'object' ? (submission.score as any)?.total : 'N/A',
      'Risk Level': typeof submission.score === 'object' ? (submission.score as any)?.riskLevel : 'N/A',
    }));
  }
  
  private generateRiskData(submissions: FormSubmission[]) {
    const distribution = this.calculateRiskDistribution(submissions);
    return [
      { 'Risk Level': 'Critical', Count: distribution.critical, 'Percentage': ((distribution.critical / submissions.length) * 100).toFixed(1) + '%' },
      { 'Risk Level': 'High', Count: distribution.high, 'Percentage': ((distribution.high / submissions.length) * 100).toFixed(1) + '%' },
      { 'Risk Level': 'Medium', Count: distribution.medium, 'Percentage': ((distribution.medium / submissions.length) * 100).toFixed(1) + '%' },
      { 'Risk Level': 'Low', Count: distribution.low, 'Percentage': ((distribution.low / submissions.length) * 100).toFixed(1) + '%' },
    ];
  }
}