import { Component, Output, EventEmitter } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { FormField } from '@app/models/form.model';

@Component({
  selector: 'app-field-palette',
  templateUrl: './field-palette.component.html',
  styleUrls: ['./field-palette.component.scss']
})
export class FieldPaletteComponent {
  
  handleDragStart(event: CdkDragStart, type: string): void {
    event.source.element.nativeElement.style.cursor = 'grabbing';
    if (event.source.element.nativeElement) {
      event.source.element.nativeElement.setAttribute('data-field-type', type);
    }
  }
  
  handleAddField(type: string): void {
  }
}