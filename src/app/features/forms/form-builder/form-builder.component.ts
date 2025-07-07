import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Form, FormField, DocumentAttachment } from '../../../models/form.model';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {
  formFields: FormField[] = [];
  formMetadata: FormGroup;
  selectedField: FormField | null = null;
  formAttachments: DocumentAttachment[] = [];
  formCategory: string | string[] = '';
  formTargetAudience: string | string[] = '';
  isPublished = false;
  currentFormId: string | null = null;
  
  // Mobile view controls
  showFieldPalette = false;
  showFieldEditor = false;
  
  // Tab controls
  activeBuildTab = 'builder';
  
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.formMetadata = this.fb.group({
      title: ['Untitled Form', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.currentFormId = params['id'];
        this.loadForm(this.currentFormId);
      }
    });
  }

  loadForm(formId: string): void {
    // In a real app, this would fetch from a service
    console.log(`Loading form with ID: ${formId}`);
    
    // Simulate loading a form
    setTimeout(() => {
      this.formMetadata.patchValue({
        title: 'Sample Loaded Form',
        description: 'This is a form loaded from the server'
      });
      
      this.formFields = [
        {
          id: '1',
          type: 'text',
          label: 'Full Name',
          required: true,
          placeholder: 'Enter your full name'
        },
        {
          id: '2',
          type: 'email',
          label: 'Email Address',
          required: true,
          placeholder: 'Enter your email'
        },
        {
          id: '3',
          type: 'select',
          label: 'Department',
          required: true,
          options: ['HR', 'IT', 'Finance', 'Marketing', 'Operations']
        }
      ];
      
      this.snackBar.open('Form loaded successfully', 'Close', {
        duration: 3000
      });
    }, 500);
  }

  addField(field: FormField): void {
    const newField = { ...field, id: Date.now().toString() };
    this.formFields = [...this.formFields, newField];
    this.selectedField = newField;
    this.showFieldPalette = false;
  }

  updateField(fieldId: string, updates: Partial<FormField>): void {
    this.formFields = this.formFields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    );
    
    // Update selected field if it's the one being edited
    if (this.selectedField && this.selectedField.id === fieldId) {
      this.selectedField = { ...this.selectedField, ...updates };
    }
  }

  removeField(fieldId: string): void {
    this.formFields = this.formFields.filter(field => field.id !== fieldId);
    
    // Clear selected field if it's the one being removed
    if (this.selectedField && this.selectedField.id === fieldId) {
      this.selectedField = null;
    }
  }

  selectField(fieldId: string | null): void {
    if (!fieldId) {
      this.selectedField = null;
      return;
    }
    
    this.selectedField = this.formFields.find(field => field.id === fieldId) || null;
    
    if (this.selectedField) {
      this.showFieldEditor = true;
    }
  }

  reorderFields(event: any): void {
    // Implementation for drag and drop reordering
    const { previousIndex, currentIndex } = event;
    const field = this.formFields[previousIndex];
    this.formFields.splice(previousIndex, 1);
    this.formFields.splice(currentIndex, 0, field);
  }

  updateFormTitle(title: string): void {
    this.formMetadata.patchValue({ title });
  }

  updateFormDescription(description: string): void {
    this.formMetadata.patchValue({ description });
  }

  updateAttachments(attachments: DocumentAttachment[]): void {
    this.formAttachments = attachments;
  }

  updateCategory(category: string | string[]): void {
    this.formCategory = category;
  }

  updateTargetAudience(audience: string | string[]): void {
    this.formTargetAudience = audience;
  }

  saveForm(): void {
    if (this.formMetadata.invalid) {
      this.snackBar.open('Please provide a title for your form', 'Close', {
        duration: 3000
      });
      return;
    }
    
    // In a real app, this would save to a service
    console.log('Saving form:', {
      id: this.currentFormId || Date.now().toString(),
      ...this.formMetadata.value,
      fields: this.formFields,
      attachments: this.formAttachments,
      category: this.formCategory,
      targetAudience: this.formTargetAudience
    });
    
    this.snackBar.open('Form saved successfully', 'Close', {
      duration: 3000
    });
  }

  publishForm(): void {
    if (this.formMetadata.invalid) {
      this.snackBar.open('Please provide a title for your form', 'Close', {
        duration: 3000
      });
      return;
    }
    
    if (this.formFields.length === 0) {
      this.snackBar.open('Please add at least one field to your form', 'Close', {
        duration: 3000
      });
      return;
    }
    
    this.isPublished = true;
    
    // In a real app, this would publish via a service
    console.log('Publishing form:', {
      id: this.currentFormId || Date.now().toString(),
      ...this.formMetadata.value,
      fields: this.formFields,
      attachments: this.formAttachments,
      category: this.formCategory,
      targetAudience: this.formTargetAudience,
      status: 'published'
    });
    
    this.snackBar.open('Form published successfully', 'Close', {
      duration: 3000
    });
  }

  moveToDraft(): void {
    this.isPublished = false;
    
    // In a real app, this would update via a service
    this.snackBar.open('Form moved to draft', 'Close', {
      duration: 3000
    });
  }

  saveToLibrary(): void {
    if (!this.formCategory) {
      this.snackBar.open('Please select a category before saving to library', 'Close', {
        duration: 3000
      });
      return;
    }
    
    if (this.formMetadata.invalid) {
      this.snackBar.open('Please provide a title for your form', 'Close', {
        duration: 3000
      });
      return;
    }
    
    // In a real app, this would save to a template library
    console.log('Saving to library:', {
      ...this.formMetadata.value,
      fields: this.formFields,
      category: this.formCategory,
      targetAudience: this.formTargetAudience
    });
    
    this.snackBar.open('Form saved to library', 'Close', {
      duration: 3000
    });
  }

  setActiveTab(tab: string): void {
    this.activeBuildTab = tab;
  }
}