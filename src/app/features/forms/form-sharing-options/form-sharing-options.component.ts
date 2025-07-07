import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Form } from '../../../models/form.model';

@Component({
  selector: 'app-form-sharing-options',
  templateUrl: './form-sharing-options.component.html',
  styleUrls: ['./form-sharing-options.component.scss']
})
export class FormSharingOptionsComponent {
  @Input() form!: Form;
  
  constructor(private snackBar: MatSnackBar) {}
  
  generateFormUrl(): string {
    return `${window.location.origin}/form/${this.form.id}`;
  }
  
  generateEmbedCode(width = "100%", height = "600px"): string {
    const formUrl = this.generateFormUrl();
    return `<iframe src="${formUrl}" width="${width}" height="${height}" frameborder="0" title="${this.form.title}" style="border: none;"></iframe>`;
  }
  
  generateResponsiveEmbedCode(): string {
    const formUrl = this.generateFormUrl();
    return `<div style="position: relative; width: 100%; height: 0; padding-bottom: 75%;">
  <iframe src="${formUrl}" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" 
    title="${this.form.title}">
  </iframe>
</div>`;
  }
  
  copyToClipboard(text: string, type: string): void {
    navigator.clipboard.writeText(text);
    this.snackBar.open(`${type} copied to clipboard`, 'Close', {
      duration: 3000
    });
  }
  
  exportToPDF(): void {
    // PDF export functionality will be implemented here
    this.snackBar.open('PDF export functionality coming soon', 'Close', {
      duration: 3000
    });
  }
  
  openInNewTab(url: string): void {
    window.open(url, '_blank');
  }
  
  // Helper method to format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}