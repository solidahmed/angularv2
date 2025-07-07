import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Form, EmailRecipient } from '@app/models/form.model';

@Component({
  selector: 'app-form-invitations',
  templateUrl: './form-invitations.component.html',
  styleUrls: ['./form-invitations.component.scss']
})
export class FormInvitationsComponent {
  @Input() form: Form;
  @Output() formChange = new EventEmitter<Form>();
  
  updateRecipients(recipients: EmailRecipient[]): void {
    if (!this.form.settings.emailDistribution) {
      const emailSettings = {
        enabled: true,
        recipients: [],
        reminderEnabled: true,
        reminderIntervalDays: 7,
        maxReminders: 3
      };
      this.form.settings.emailDistribution = emailSettings;
    }
    
    this.form.settings.emailDistribution.recipients = recipients;
    this.formChange.emit(this.form);
  }
}