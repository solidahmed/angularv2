import { Component, Input } from '@angular/core';
import { Form } from '../../../models/form.model';

@Component({
  selector: 'app-form-invitation-statistics',
  templateUrl: './form-invitation-statistics.component.html',
  styleUrls: ['./form-invitation-statistics.component.scss']
})
export class FormInvitationStatisticsComponent {
  @Input() form!: Form;
  
  get emailSettings() {
    return this.form.settings.emailDistribution || {
      enabled: false,
      recipients: [],
      reminderEnabled: true,
      reminderIntervalDays: 7,
      maxReminders: 3
    };
  }
  
  get completedCount() {
    return this.emailSettings.recipients.filter(r => r.status === 'completed').length;
  }
  
  get startedCount() {
    return this.emailSettings.recipients.filter(r => ['sent', 'opened'].includes(r.status)).length;
  }
  
  get notStartedCount() {
    return this.emailSettings.recipients.filter(r => r.status === 'pending').length;
  }
  
  get completionRate() {
    return this.emailSettings.recipients.length > 0 
      ? Math.round((this.completedCount / this.emailSettings.recipients.length) * 100)
      : 0;
  }
}