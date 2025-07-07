import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormSubmission, Form } from '../../../models/form.model';

@Component({
  selector: 'app-submissions-list',
  templateUrl: './submissions-list.component.html',
  styleUrls: ['./submissions-list.component.scss']
})
export class SubmissionsListComponent {
  @Input() submissions: FormSubmission[] = [];
  @Input() selectedSubmission: FormSubmission | null = null;
  @Input() form: Form | null = null;
  
  @Output() selectSubmission = new EventEmitter<FormSubmission>();
  
  onSelectSubmission(submission: FormSubmission): void {
    this.selectSubmission.emit(submission);
  }
}