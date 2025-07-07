import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormSubmission } from '@app/models/form.model';
import { ReportConfig } from '@app/services/report-generator.service';

@Component({
  selector: 'app-report-customization',
  templateUrl: './report-customization.component.html',
  styleUrls: ['./report-customization.component.scss']
})
export class ReportCustomizationComponent implements OnInit {
  @Input() submissions: FormSubmission[] = [];
  @Output() generateReport = new EventEmitter<ReportConfig>();
  
  reportForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      title: [''],
      includeTimestamp: [true],
      format: ['pdf']
    });
  }
  
  ngOnInit(): void {
  }
  
  onSubmit(): void {
    this.generateReport.emit(this.reportForm.value as ReportConfig);
  }
}