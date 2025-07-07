import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormField } from '@app/models/form.model';

@Component({
  selector: 'app-field-editor',
  templateUrl: './field-editor.component.html',
  styleUrls: ['./field-editor.component.scss']
})

updateField(updates: Partial<FormField>): void {
  if (this.readOnly || !this.selectedField) return;
  this.onUpdateField.emit({ fieldId: this.selectedField.id, updates });
}

updateScoring(updates: Partial<any>): void {
}