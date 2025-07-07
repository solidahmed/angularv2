import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Form, EmailRecipient } from '../../../models/form.model';

@Component({
  selector: 'app-recipient-management',
  templateUrl: './recipient-management.component.html',
  styleUrls: ['./recipient-management.component.scss']
})
export class RecipientManagementComponent {
  @Input() form!: Form;
  @Output() updateForm = new EventEmitter<Partial<Form>>();
  
  recipientForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.recipientForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['']
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
  
  addRecipient(): void {
    if (this.recipientForm.invalid) {
      this.snackBar.open('Please enter a valid email address', 'Close', {
        duration: 3000
      });
      return;
    }
    
    const { email, name } = this.recipientForm.value;
    
    const existingRecipient = this.emailSettings.recipients.find(
      r => r.email.toLowerCase() === email.toLowerCase()
    );
    
    if (existingRecipient) {
      this.snackBar.open('This email address is already in the recipient list', 'Close', {
        duration: 3000
      });
      return;
    }
    
    const newRecipient: EmailRecipient = {
      id: Date.now().toString(),
      email: email.trim(),
      name: name.trim() || undefined,
      status: 'pending',
      remindersSent: 0
    };
    
    const updatedRecipients = [...this.emailSettings.recipients, newRecipient];
    
    this.updateForm.emit({
      settings: {
        ...this.form.settings,
        emailDistribution: {
          ...this.emailSettings,
          recipients: updatedRecipients
        }
      }
    });
    
    this.recipientForm.reset();
    
    this.snackBar.open(`${newRecipient.email} has been added to the invitation list`, 'Close', {
      duration: 3000
    });
  }
  
  removeRecipient(recipientId: string): void {
    const updatedRecipients = this.emailSettings.recipients.filter(r => r.id !== recipientId);
    
    this.updateForm.emit({
      settings: {
        ...this.form.settings,
        emailDistribution: {
          ...this.emailSettings,
          recipients: updatedRecipients
        }
      }
    });
    
    this.snackBar.open('Recipient has been removed from the invitation list', 'Close', {
      duration: 3000
    });
  }
  
  sendInvitations(): void {
    const pendingRecipients = this.emailSettings.recipients.filter(r => r.status === 'pending');
    
    if (pendingRecipients.length === 0) {
      this.snackBar.open('All recipients have already been sent invitations', 'Close', {
        duration: 3000
      });
      return;
    }
    
    const updatedRecipients = this.emailSettings.recipients.map(recipient => {
      if (recipient.status === 'pending') {
        return {
          ...recipient,
          status: 'sent' as const,
          sentAt: new Date()
        };
      }
      return recipient;
    });
    
    this.updateForm.emit({
      settings: {
        ...this.form.settings,
        emailDistribution: {
          ...this.emailSettings,
          recipients: updatedRecipients
        }
      }
    });
    
    this.snackBar.open(`Sent invitations to ${pendingRecipients.length} recipients`, 'Close', {
      duration: 3000
    });
  }
  
  getStatusIcon(status: EmailRecipient['status']): string {
    switch (status) {
      case 'pending': return 'schedule';
      case 'sent': return 'mail';
      case 'opened': return 'open_in_new';
      case 'completed': return 'check_circle';
      case 'expired': return 'cancel';
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
}