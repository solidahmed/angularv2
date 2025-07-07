import { Component, Input } from '@angular/core';
import { FormSubmission } from '../../../../models/form.model';
import { ReportGeneratorService, ReportConfig } from '../../../../services/report-generator.service';

@Component({
  selector: 'app-report-generation',
  templateUrl: './report-generation.component.html',
  styleUrls: ['./report-generation.component.scss']
})
export class ReportGenerationComponent {
  @Input() submissions: FormSubmission[] = [];
  
  constructor(private reportGenerator: ReportGeneratorService) {}
  
  generateReport(config: ReportConfig): void {
    this.reportGenerator.generateReport(this.submissions, config);
  }
}