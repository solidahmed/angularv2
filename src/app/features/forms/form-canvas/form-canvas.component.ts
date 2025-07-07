import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormField } from '@app/models/form.model';

@Component({
  selector: 'app-form-canvas',
  templateUrl: './form-canvas.component.html',
  styleUrls: ['./form-canvas.component.scss']
})
export class FormCanvasComponent {
  @Input() fields: FormField[] = [];
  @Input() selectedField: FormField | null = null;
  @Input() readOnly = false;
  
  @Output() selectField = new EventEmitter<string | null>();
  @Output() updateField = new EventEmitter<{id: string, updates: Partial<FormField>}>();
  @Output() removeField = new EventEmitter<string>();
  @Output() reorderFields = new EventEmitter<any>();
  
  isDragOver = false;
  dragOverIndex: number | null = null;
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    this.dragOverIndex = null;
    
    if (this.readOnly) return;
    
    try {
      const data = JSON.parse(event.dataTransfer?.getData('application/json') || '{}');
      
      if (data.source === 'palette') {
        // This would be handled by the parent component
        console.log('Field dropped from palette:', data.fieldType);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  }
  
  onDragOver(event: DragEvent): void {
    if (this.readOnly) return;
    
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'copy';
    this.isDragOver = true;
  }
  
  onDragLeave(event: DragEvent): void {
    if (this.readOnly) return;
    
    if (!event.currentTarget?.contains(event.relatedTarget as Node)) {
      this.isDragOver = false;
      this.dragOverIndex = null;
    }
  }
  
  onFieldDragStart(event: DragEvent, fieldId: string): void {
    if (this.readOnly) {
      event.preventDefault();
      return;
    }
    
    const dataTransfer = event.dataTransfer;
    if (dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify({
        source: 'field',
        fieldId
      }));
      event.dataTransfer.effectAllowed = 'move';
    }
  }
  
  onFieldDragOver(event: DragEvent, index: number): void {
    if (this.readOnly) return;
    
    event.preventDefault();
    event.stopPropagation();
    this.dragOverIndex = index;
  }
  
  onDrop2(event: CdkDragDrop<FormField[]>): void {
    if (this.readOnly) return;
    
    moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
    this.reorderFields.emit({
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex
    });
  }
  
  onFieldClick(fieldId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.selectField.emit(fieldId);
  }
  
  onRemoveField(fieldId: string, event: MouseEvent): void {
    event.stopPropagation();
    if (!this.readOnly) {
      this.removeField.emit(fieldId);
    }
  }
  
  getFieldIcon(field: FormField): string {
    return field.type === 'text' ? 'text_fields' : 'check_box';
  }
}