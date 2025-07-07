import { Component, EventEmitter, Output } from '@angular/core';
import { FormField } from '../../../models/form.model';

@Component({
  selector: 'app-field-palette',
  templateUrl: './field-palette.component.html',
  styleUrls: ['./field-palette.component.scss']
})
export class FieldPaletteComponent {
  @Output() addField = new EventEmitter<FormField>();
  
  fieldTypes = [
    { type: 'text', label: 'Text Input', icon: 'text_fields' },
    { type: 'email', label: 'Email', icon: 'email' },
    { type: 'number', label: 'Number', icon: 'tag' },
    { type: 'textarea', label: 'Textarea', icon: 'notes' },
    { type: 'select', label: 'Dropdown', icon: 'arrow_drop_down_circle' },
    { type: 'radio', label: 'Radio Button', icon: 'radio_button_checked' },
    { type: 'checkbox', label: 'Checkbox', icon: 'check_box' },
    { type: 'date', label: 'Date Picker', icon: 'calendar_today' },
    { type: 'file', label: 'File Upload', icon: 'upload_file' },
    { type: 'rating', label: 'Rating', icon: 'star' },
    { type: 'signature', label: 'Signature', icon: 'draw' }
  ];
  
  handleAddField(type: string): void {
    const newField: Partial<FormField> = {
      type,
      label: `New ${type} field`,
      required: false
    };
    
    // Add options for fields that need them
    if (['select', 'radio', 'checkbox'].includes(type)) {
      newField.options = ['Option 1', 'Option 2'];
    }
    
    this.addField.emit(newField as FormField);
  }
  
  onDragStart(event: DragEvent, type: string): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify({
        fieldType: type
      }));
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  handleAddField(type: string): void {
    const newField: Partial<FormField> = {
      type,
      label: `New ${type} field`,
      required: false
    };
    
    if (['select', 'radio', 'checkbox'].includes(type)) {
      newField.options = ['Option 1', 'Option 2'];
    }
    
    this.addField.emit(newField as FormField);
  }
}