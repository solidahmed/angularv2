import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DocumentAttachment } from '../../../models/form.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-attachment-manager',
  templateUrl: './file-attachment-manager.component.html',
  styleUrls: ['./file-attachment-manager.component.scss']
})
export class FileAttachmentManagerComponent {
  @Input() attachments: DocumentAttachment[] = [];
  @Input() allowedTypes: string[] = [];
  @Input() maxSize: number = 10;
  @Input() readOnly: boolean = false;
  
  @Output() updateAttachments = new EventEmitter<DocumentAttachment[]>();
  
  uploading = false;
  
  constructor(private snackBar: MatSnackBar) {}
  
  handleReadOnlyAction(): void {
    this.snackBar.open('Form is Published', 'Move this form to draft state to make changes.', {
      duration: 3000
    });
  }
  
  handleFileUpload(event: any): void {
    if (this.readOnly) {
      this.handleReadOnlyAction();
      return;
    }
    
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    this.uploading = true;
    const newAttachments: DocumentAttachment[] = [];
    
    for (const file of Array.from(files)) {
      // Validate file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!this.allowedTypes.includes(fileExtension || '')) {
        this.snackBar.open(
          `File type .${fileExtension} is not allowed. Allowed types: ${this.allowedTypes.join(', ')}`,
          'Close',
          { duration: 3000 }
        );
        continue;
      }
      
      // Validate file size (convert MB to bytes)
      if (file.size > this.maxSize * 1024 * 1024) {
        this.snackBar.open(
          `File ${file.name} exceeds the maximum size of ${this.maxSize}MB`,
          'Close',
          { duration: 3000 }
        );
        continue;
      }
      
      // Create object URL for the file (in a real app, you'd upload to a server)
      const url = URL.createObjectURL(file);
      
      const attachment: DocumentAttachment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        url: url,
        uploadedAt: new Date()
      };
      
      newAttachments.push(attachment);
    }
    
    this.updateAttachments.emit([...this.attachments, ...newAttachments]);
    this.uploading = false;
    
    if (newAttachments.length > 0) {
      this.snackBar.open(`${newAttachments.length} file(s) uploaded successfully`, 'Close', {
        duration: 3000
      });
    }
    
    // Reset input
    event.target.value = '';
  }
  
  removeAttachment(attachmentId: string): void {
    if (this.readOnly) {
      this.handleReadOnlyAction();
      return;
    }
    
    const attachment = this.attachments.find(a => a.id === attachmentId);
    if (attachment) {
      // Revoke object URL to free memory
      URL.revokeObjectURL(attachment.url);
    }
    
    this.updateAttachments.emit(this.attachments.filter(a => a.id !== attachmentId));
    
    this.snackBar.open('The file has been removed from the form', 'Close', {
      duration: 3000
    });
  }
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  downloadFile(attachment: DocumentAttachment): void {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}