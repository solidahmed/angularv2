import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Form } from '../../../models/form.model';

@Component({
  selector: 'app-email-template-customization',
  templateUrl: './email-template-customization.component.html',
  styleUrls: ['./email-template-customization.component.scss']
})
export class EmailTemplateCustomizationComponent implements OnInit {
  @Input() form!: Form;
  
  emailForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      subject: [''],
      message: ['']
    });
  }
  
  ngOnInit(): void {
    this.emailForm.patchValue({
      subject: `You're invited to complete: ${this.form.title}`,
      message: `Hello,\n\nYou have been invited to complete the form "${this.form.title}".\n\nPlease click the link below to get started:\n[FORM_LINK]\n\nThank you!`
    });
  }
  
  get emailSettings() {
    return this.form.settings.emailDistribution || {
      enabled: false,
      recipients: [],
      reminderEnabled: true,
      reminderIntervalDays: 7,
      maxReminders: 3
    };
  }
}