import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Form } from '../../../models/form.model';

@Component({
  selector: 'app-email-distribution-settings',
  templateUrl: './email-distribution-settings.component.html',
  styleUrls: ['./email-distribution-settings.component.scss']
})
export class EmailDistributionSettingsComponent {
  @Input() form!: Form;
  @Output() updateForm = new EventEmitter<Partial<Form>>();

  // Helper method to parse integers
  parseInt(value: string): number {
    return parseInt(value) || 0;
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
  
  updateEmailSettings(updates: Partial<typeof this.emailSettings>): void {
    this.updateForm.emit({
      settings: {
        ...this.form.settings,
        emailDistribution: {
          ...this.emailSettings,
          ...updates
        }
      }
    });
  }
}