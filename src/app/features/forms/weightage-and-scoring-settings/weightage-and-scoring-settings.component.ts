import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormField, FormSettings } from '../../../models/form.model';

@Component({
  selector: 'app-weightage-and-scoring-settings',
  templateUrl: './weightage-and-scoring-settings.component.html',
  styleUrls: ['./weightage-and-scoring-settings.component.scss']
})
export class WeightageAndScoringSettingsComponent {
  @Input() fields: FormField[] = [];
  @Input() settings: FormSettings = {
    allowMultipleSubmissions: false,
    requireLogin: false,
    showProgressBar: true,
    theme: 'light'
  };
  
  @Output() updateField = new EventEmitter<{fieldId: string, updates: Partial<FormField>}>();
  @Output() updateSettings = new EventEmitter<Partial<FormSettings>>();
  
  // Helper method to parse integers
  parseInt(value: string): number {
    return parseInt(value) || 0;
  }
  
  get scoringFields(): FormField[] {
    return this.fields.filter(field => field.scoring?.enabled);
  }
  
  handleScoringSettingChange(field: string, value: any): void {
    const currentScoring = this.settings.scoring || {
      enabled: false,
      maxTotalPoints: 100,
      showScoreToUser: false,
      passingScore: 70,
      riskThresholds: {
        low: 30,
        medium: 60,
        high: 90
      }
    };

    this.updateSettings({
      scoring: {
        ...currentScoring,
        [field]: value
      }
    });
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