import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Form } from '@app/models/form.model';

@Component({
  selector: 'app-form-invitations',
  templateUrl: './form-invitations.component.html',
  styleUrls: ['./form-invitations.component.scss']
})
export class FormInvitationsComponent {
  @Input() form!: Form;
  @Output() updateForm = new EventEmitter<Partial<Form>>();
  
  activeTab = 'invite';
  
  constructor() {}
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}