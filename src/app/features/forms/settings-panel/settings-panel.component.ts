import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Form } from '../../../models/form.model';

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.scss']
})
export class SettingsPanelComponent {
  @Input() form!: Form;
  @Output() onUpdate = new EventEmitter<Form>();
  
  isExpirationEnabled = false;
  isEmailDistributionEnabled = false;
  isApprovalEnabled = false;
  isDocumentsEnabled = false;
  
  // Helper method to parse integers
  parseInt(value: string): number {
    return parseInt(value) || 0;
  }
  
  ngOnInit(): void {
    this.isExpirationEnabled = this.form.settings.expiration?.enabled || false;
    this.isEmailDistributionEnabled = this.form.settings.emailDistribution?.enabled || false;
    this.isApprovalEnabled = this.form.settings.approval?.enabled || false;
    this.isDocumentsEnabled = this.form.settings.documents?.enabled || false;
  }
  
  handleSettingChange(field: string, value: any): void {
    this.onUpdate.emit({
      ...this.form,
      settings: {
        ...this.form.settings,
        [field]: value
      }
    });
  }
  
  handleFieldUpdate(fieldId: string, updates: any): void {
    const updatedFields = this.form.fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    );
    
    this.onUpdate.emit({
      ...this.form,
      fields: updatedFields
    });
  }
  
  handleSettingsUpdate(updates: any): void {
    this.onUpdate.emit({
      ...this.form,
      settings: {
        ...this.form.settings,
        ...updates
      }
    });
  }
  
  handleExpirationChange(field: string, value: any): void {
    const currentExpiration = this.form.settings.expiration || {
      enabled: this.isExpirationEnabled,
      expirationDate: new Date(),
      message: 'This form has expired.'
    };
    
    this.onUpdate.emit({
      ...this.form,
      settings: {
        ...this.form.settings,
        expiration: {
          ...currentExpiration,
          [field]: value
        }
      }
    });
  }
  
  handleEmailDistributionChange(field: string, value: any): void {
    const currentEmailDistribution = this.form.settings.emailDistribution || {
      enabled: this.isEmailDistributionEnabled,
      recipients: [],
      reminderEnabled: false,
      reminderIntervalDays: 7,
      maxReminders: 3
    };
    
    this.onUpdate.emit({
      ...this.form,
      settings: {
        ...this.form.settings,
        emailDistribution: {
          ...currentEmailDistribution,
          [field]: value
        }
      }
    });
  }
  
  handleApprovalChange(field: string, value: any): void {
    const currentApproval = this.form.settings.approval || {
      enabled: this.isApprovalEnabled,
      requireApproval: false,
      approvers: [],
      autoApproveScore: 80
    };
    
    this.onUpdate.emit({
      ...this.form,
      settings: {
        ...this.form.settings,
        approval: {
          ...currentApproval,
          [field]: value
        }
      }
    });
  }
  
  handleDocumentChange(field: string, value: any): void {
    const currentDocuments = this.form.settings.documents || {
      enabled: this.isDocumentsEnabled,
      allowedTypes: ['pdf', 'doc', 'docx'],
      maxSize: 10,
      requiredDocuments: [],
      allowUserUploads: true
    };
    
    this.onUpdate.emit({
      ...this.form,
      settings: {
        ...this.form.settings,
        documents: {
          ...currentDocuments,
          [field]: value
        }
      }
    });
  }
  
  handleThemeChange(theme: 'light' | 'dark' | 'custom'): void {
    this.onUpdate.emit({
      ...this.form,
      settings: {
        ...this.form.settings,
        theme
      }
    });
  }
  
  handleCustomCssChange(customCss: string): void {
    if (this.form.settings.theme === 'custom') {
      this.onUpdate.emit({
        ...this.form,
        settings: {
          ...this.form.settings,
          customCss
        }
      });
    }
  }
}