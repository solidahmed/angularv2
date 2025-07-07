import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormField } from '@app/models/form.model';

@Component({
  updateScoring(updates: Partial<any>): void {
    if (this.readOnly || !this.selectedField) return;
    this.updateField({
      scoring: {
        ...this.selectedField.scoring,
        ...updates
      }
    });
  },
  templateUrl: './field-editor.component.html',
  styleUrls: ['./field-editor.component.scss']
})
export class FieldEditorComponent {
  @Input() set selectedField(field: FormField | null) {
    this._selectedField = field;
    this.initForm();
  }
  get selectedField(): FormField | null {
    return this._selectedField;
  }
  
  @Input() readOnly = false;
  
  @Output() updateField = new EventEmitter<{id: string, updates: Partial<FormField>}>();
  
  private _selectedField: FormField | null = null;
  fieldForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.fieldForm = this.fb.group({
      label: ['', Validators.required],
      placeholder: [''],
      required: [false],
      validation: this.fb.group({
        message: ['']
      }),
      scoring: this.fb.group({
        enabled: [false],
        maxPoints: [10],
        weightMultiplier: [1],
        requiresManualReview: [false]
      })
    });
  }
  
  initForm(): void {
    if (!this.selectedField) {
      this.fieldForm.reset();
      return;
    }
    
    this.fieldForm.patchValue({
      label: this.selectedField.label,
      placeholder: this.selectedField.placeholder || '',
      required: this.selectedField.required,
      validation: {
        message: this.selectedField.validation?.message || ''
      },
      scoring: {
        enabled: this.selectedField.scoring?.enabled || false,
        maxPoints: this.selectedField.scoring?.maxPoints || 10,
        weightMultiplier: this.selectedField.scoring?.weightMultiplier || 1,
        requiresManualReview: this.selectedField.scoring?.requiresManualReview || false
      }
    });
    
    // Disable form if in read-only mode
    if (this.readOnly) {
      this.fieldForm.disable();
    } else {
      this.fieldForm.enable();
    }
    
    // Listen for form changes
    this.fieldForm.valueChanges.subscribe(value => {
      if (this.selectedField && !this.readOnly) {
        this.updateField.emit({
          id: this.selectedField.id,
          updates: value
        });
      }
    });
  }
  
  addOption(): void {
    if (this.readOnly || !this.selectedField) return;
    
    const currentOptions = this.selectedField.options || [];
    this.updateField.emit({
      id: this.selectedField.id,
      updates: { options: [...currentOptions, `Option ${currentOptions.length + 1}`] }
    });
  }
  
  updateOption(index: number, value: string): void {
    if (this.readOnly || !this.selectedField || !this.selectedField.options) return;
    
    const newOptions = [...this.selectedField.options];
    newOptions[index] = value;
    
    this.updateField.emit({
      id: this.selectedField.id,
      updates: { options: newOptions }
    });
  }
  
  removeOption(index: number): void {
    if (this.readOnly || !this.selectedField || !this.selectedField.options) return;
    
    const newOptions = this.selectedField.options.filter((_, idx) => idx !== index);
    
    this.updateField.emit({
      id: this.selectedField.id,
      updates: { options: newOptions }
    });
  }
  
  addCorrectAnswer(): void {
    if (this.readOnly || !this.selectedField) return;
    
    const currentAnswers = this.selectedField.scoring?.correctAnswers || [];
    
    this.updateField.emit({
      id: this.selectedField.id,
      updates: { 
        scoring: {
          ...this.selectedField.scoring,
          enabled: this.selectedField.scoring?.enabled || false,
          correctAnswers: [...currentAnswers, '']
        }
      }
    });
  }
  
  updateCorrectAnswer(index: number, value: string): void {
    if (this.readOnly || !this.selectedField || !this.selectedField.scoring?.correctAnswers) return;
    
    const newAnswers = [...this.selectedField.scoring.correctAnswers];
    newAnswers[index] = value;
    
    this.updateField.emit({
      id: this.selectedField.id,
      updates: { 
        scoring: {
          ...this.selectedField.scoring,
          correctAnswers: newAnswers
        }
      }
    });
  }
  
  removeCorrectAnswer(index: number): void {
    if (this.readOnly || !this.selectedField || !this.selectedField.scoring?.correctAnswers) return;
    
    const newAnswers = this.selectedField.scoring.correctAnswers.filter((_, idx) => idx !== index);
    
    this.updateField.emit({
      id: this.selectedField.id,
      updates: { 
        scoring: {
          ...this.selectedField.scoring,
          correctAnswers: newAnswers
        }
      }
    });
  }
  
  updateField(updates: Partial<FormField>): void {
    if (this.readOnly || !this.selectedField) return;
    this.onUpdateField.emit({ id: this.selectedField.id, updates });
  }
}