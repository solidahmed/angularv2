import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormSubmission } from '@app/models/form.model';
import { ChartRendererService, ChartData } from '@app/services/chart-renderer.service';

@Component({
  selector: 'app-report-charts',
  templateUrl: './report-charts.component.html',
  styleUrls: ['./report-charts.component.scss']
})
export class ReportChartsComponent implements OnChanges, AfterViewInit {
  @Input() submissions: FormSubmission[] = [];
  @Input() chartType: string = 'bar';
  @Input() dataType: string = 'submissionTrends';
  
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  
  constructor(private chartRenderer: ChartRendererService) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['submissions'] || changes['chartType'] || changes['dataType']) && this.chartContainer) {
      this.renderChart();
    }
  }
  
  ngAfterViewInit(): void {
    this.renderChart();
  }
  
  private async renderChart(): Promise<void> {
    if (!this.chartContainer) return;
    
    const chartData = this.prepareChartData();
    if (!chartData) return;
    
    try {
      const chartImage = await this.chartRenderer.renderChart(chartData);
      if (chartImage) {
        const container = this.chartContainer.nativeElement;
        container.innerHTML = '';
        const img = document.createElement('img');
        img.src = chartImage;
        img.style.width = '100%';
        img.style.height = 'auto';
        container.appendChild(img);
      }
    } catch (error) {
      console.error('Error rendering chart:', error);
    }
  }
  
  private prepareChartData(): ChartData | null {
    if (!this.submissions || this.submissions.length === 0) return null;
    
    let data: any[] = [];
    let title = '';
    
    switch (this.dataType) {
      case 'submissionTrends':
        title = 'Submission Trends';
        data = this.getSubmissionTrendsData();
        break;
      case 'riskDistribution':
        title = 'Risk Distribution';
        data = this.getRiskDistributionData();
        break;
      case 'complianceStatus':
        title = 'Compliance Status';
        data = this.getComplianceStatusData();
        break;
      default:
        return null;
    }
    
    return {
      type: this.chartType,
      title,
      data
    };
  }
  
  private getSubmissionTrendsData(): any[] {
    const monthlyData = this.submissions.reduce((acc, sub) => {
      const month = new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(monthlyData).map(([month, count]) => ({
      name: month,
      value: count
    }));
  }
  
  private getRiskDistributionData(): any[] {
    const riskData = this.submissions.reduce((acc, sub) => {
      const risk = sub.score?.riskLevel || 'unknown';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(riskData).map(([risk, count]) => ({
      name: risk.charAt(0).toUpperCase() + risk.slice(1),
      value: count
    }));
  }
  
  private getComplianceStatusData(): any[] {
    const statusData = this.submissions.reduce((acc, sub) => {
      acc[sub.status] = (acc[sub.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusData).map(([status, count]) => ({
      name: status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1),
      value: count
    }));
  }
}