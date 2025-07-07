import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormField } from '@app/models/form.model';

@Component({
  selector: 'app-form-canvas',
  templateUrl: './form-canvas.component.html',
  styleUrls: ['./form-canvas.component.scss']
})
export class FormCanvasComponent implements OnInit {
  
  drop(event: CdkDragDrop<FormField[]>): void {
    if (this.readOnly) return;
    
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
      this.reorderFields.emit({ dragIndex: event.previousIndex, hoverIndex: event.currentIndex });
    }
  }
  
  getStatusIcon(field: FormField): string {
  }
}