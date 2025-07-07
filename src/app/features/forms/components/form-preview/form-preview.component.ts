import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormField, Form, DocumentAttachment } from '@app/models/form.model';

@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.scss']
})
export class FormPreviewComponent implements OnChanges {
  @Input() form: Form;
  @Input() formFields: FormField[];
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.form || changes.formFields) {
      // Handle changes
    }
  }
  
  downloadFile(attachment: DocumentAttachment): void {
    if (attachment && attachment.url) {
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}