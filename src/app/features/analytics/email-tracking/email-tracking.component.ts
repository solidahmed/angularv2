import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailRecipient } from '../../../models/form.model';

@Component({
  selector: 'app-email-tracking',
  templateUrl: './email-tracking.component.html',
  styleUrls: ['./email-tracking.component.scss']
})
export class EmailTrackingComponent implements OnInit {
  recipients: EmailRecipient[] = [];
  emailSettingsForm: FormGroup;
  newRecipientForm: FormGroup;
  bulkEmails: string = '';
  
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.emailSettingsForm = this.fb.group({
      reminderEnabled: [true],
      reminderIntervalDays: [7],
      maxReminders: [3],
      customMessage: ['']
    });
    
    this.newRecipientForm = this.fb.group({
      email: [''],
      name: ['']
    });
  }

  ngOnInit(): void {
    // Load sample data
    this.loadSampleData();
  }

  loadSampleData(): void {
    this.recipients = [
      {
        id: '1',
        email: 'john.doe@example.com',
        name: 'John Doe',
        status: 'completed',
        remindersSent: 0,
        sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        status: 'sent',
        remindersSent: 1,
        sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        lastReminderAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        email: 'mike.wilson@example.com',
        name: 'Mike Wilson',
        status: 'pending',
        remindersSent: 0
      }
    ];
  }

  addRecipient(): void {
    const { email, name } = this.newRecipientForm.value;
    
    if (!email || !email.includes('@')) {
      this.snackBar.open('Please enter a valid email address', 'Close', {
        duration: 3000
      });
      return;
    }
    
    const newRecipient: EmailRecipient = {
      id: Date.now().toString(),
      email,
      name: name || undefined,
      status: 'pending',
      remindersSent: 0
    };
    
    this.recipients = [...this.recipients, newRecipient];
    this.newRecipientForm.reset();
    
    this.snackBar.open(`${email} has been added to the recipient list`, 'Close', {
      duration: 3000
    });
  }

  addBulkRecipients(): void {
    const emails = this.bulkEmails
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line.includes('@'));
    
    if (emails.length === 0) {
      this.snackBar.open('Please enter valid email addresses, one per line', 'Close', {
        duration: 3000
      });
      return;
    }
    
    const newRecipients: EmailRecipient[] = emails.map(email => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      email,
      status: 'pending',
      remindersSent: 0
    }));
    
    this.recipients = [...this.recipients, ...newRecipients];
    this.bulkEmails = '';
    
    this.snackBar.open(`${emails.length} recipients have been added`, 'Close', {
      duration: 3000
    });
  }

  removeRecipient(id: string): void {
    this.recipients = this.recipients.filter(r => r.id !== id);
  }

  sendToAll(): void {
    const pendingRecipients = this.recipients.filter(r => r.status === 'pending');
    
    if (pendingRecipients.length === 0) {
      this.snackBar.open('No pending recipients to send to', 'Close', {
        duration: 3000
      });
      return;
    }
    
    this.recipients = this.recipients.map(recipient => 
      recipient.status === 'pending' 
        ? { ...recipient, status: 'sent', sentAt: new Date() }
        : recipient
    );
    
    this.snackBar.open(`Form sent to ${pendingRecipients.length} recipients`, 'Close', {
      duration: 3000
    });
  }

  sendReminders(): void {
    const reminderCandidates = this.recipients.filter(r => 
      r.status === 'sent' && 
      r.remindersSent < this.emailSettingsForm.value.maxReminders
    );
    
    if (reminderCandidates.length === 0) {
      this.snackBar.open('No recipients need reminders at this time', 'Close', {
        duration: 3000
      });
      return;
    }
    
    this.recipients = this.recipients.map(recipient => 
      reminderCandidates.includes(recipient)
        ? { 
            ...recipient, 
            remindersSent: recipient.remindersSent + 1,
            lastReminderAt: new Date()
          }
        : recipient
    );
    
    this.snackBar.open(`Reminders sent to ${reminderCandidates.length} recipients`, 'Close', {
      duration: 3000
    });
  }

  getStatusIcon(status: EmailRecipient['status']): string {
    switch (status) {
      case 'pending': return 'schedule';
      case 'sent': return 'mail';
      case 'opened': return 'mail';
      case 'completed': return 'check_circle';
      case 'expired': return 'error';
      default: return 'schedule';
    }
  }

  getStatusClass(status: EmailRecipient['status']): string {
    switch (status) {
      case 'pending': return 'pending';
      case 'sent': return 'sent';
      case 'opened': return 'opened';
      case 'completed': return 'completed';
      case 'expired': return 'expired';
      default: return 'pending';
    }
  }

  get completionRate(): number {
    return this.recipients.length > 0 
      ? Math.round((this.recipients.filter(r => r.status === 'completed').length / this.recipients.length) * 100)
      : 0;
  }
}