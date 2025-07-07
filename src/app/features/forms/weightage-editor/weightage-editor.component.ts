import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormField } from '../../../models/form.model';

@Component({
  selector: 'app-weightage-editor',
  templateUrl: './weightage-editor.component.html',
  styleUrls: ['./weightage-editor.component.scss']
})
export class WeightageEditorComponent {
  @Input() fields: FormField[] = [];
  @Output() updateField = new EventEmitter<{fieldId: string, updates: Partial<FormField>}>();
  
  get scoringFields(): FormField[] {
    return this.fields.filter(field => field.scoring?.enabled);
  }
  
  handleWeightChange(fieldId: string, weight: number): void {
    const field = this.fields.find(f => f.id === fieldId);
    if (field) {
      this.updateField.emit({
        fieldId,
        updates: {
          scoring: {
            ...field.scoring,
            weightMultiplier: weight
          }
        }
      });
    }
  }
  
  resetWeights(): void {
    this.scoringFields.forEach(field => {
      this.updateField.emit({
        fieldId: field.id,
        updates: {
          scoring: {
            ...field.scoring,
            weightMultiplier: 1
          }
        }
      });
    });
  }
  
  calculateImpact(fieldWeight: number): string {
    const totalWeight = this.scoringFields.reduce((sum, field) => 
      sum + (field.scoring?.weightMultiplier || 1), 0
    );
    return totalWeight > 0 ? ((fieldWeight / totalWeight) * 100).toFixed(2) : "0.00";
  }
}