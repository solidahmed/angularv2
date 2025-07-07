import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormSubmission, Form, DocumentAttachment } from '@app/models/form.model';

@Component({
  selector: 'app-submission-details',
  templateUrl: './submission-details.component.html',
  styleUrls: ['./submission-details.component.scss']
})
export class SubmissionDetailsComponent implements OnChanges {
  @Input() submission: FormSubmission;
  @Input() form: Form;

  ngOnChanges(changes: SimpleChanges) {
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
  }
}