import { Component, Input } from '@angular/core';
import { FormField, Form, DocumentAttachment } from '../../../models/form.model';

@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.scss']
})
export class FormPreviewComponent {
  @Input() formTitle: string = '';
  @Input() formDescription: string = '';
  @Input() formFields: FormField[] = [];
  @Input() formSettings?: Form['settings'];
  @Input() attachments: DocumentAttachment[] = [];
  
  get isExpired(): boolean {
    return !!(this.formSettings?.expiration?.enabled && 
      this.formSettings.expiration.expirationDate && 
      new Date() > new Date(this.formSettings.expiration.expirationDate));
  }
  
  get totalPossiblePoints(): number {
    return this.formFields
      .filter(field => field.scoring?.enabled)
      .reduce((sum, field) => {
        const points = (field.scoring?.maxPoints || 10) * (field.scoring?.weightMultiplier || 1);
        return sum + points;
      }, 0);
  }
  
  downloadFile(attachment: DocumentAttachment): void {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}