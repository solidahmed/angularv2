import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-multi-select-audience',
  templateUrl: './multi-select-audience.component.html',
  styleUrls: ['./multi-select-audience.component.scss']
})
export class MultiSelectAudienceComponent {
  @Input() selectedAudiences: string[] = [];
  @Input() disabled = false;
  @Output() audienceChange = new EventEmitter<string[]>();
  
  audienceControl = new FormControl();
  panelOpen = false;
  
  audienceOptions = [
    { value: 'vendor', label: 'Vendor', icon: 'business' },
    { value: 'internal', label: 'Internal', icon: 'people' },
    { value: 'external', label: 'External', icon: 'public' }
  ];
  
  constructor() {}
  
  toggleAudience(audience: string): void {
    if (this.disabled) return;
    
    const index = this.selectedAudiences.indexOf(audience);
    if (index === -1) {
      this.selectedAudiences = [...this.selectedAudiences, audience];
    } else {
      this.selectedAudiences = this.selectedAudiences.filter(a => a !== audience);
    }
    
    this.audienceChange.emit(this.selectedAudiences);
  }
  
  removeAudience(audience: string, event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled) return;
    
    this.selectedAudiences = this.selectedAudiences.filter(a => a !== audience);
    this.audienceChange.emit(this.selectedAudiences);
  }
  
  getAudienceOption(value: string): any {
    return this.audienceOptions.find(opt => opt.value === value);
  }
  
  getDisplayText(): string {
    if (this.selectedAudiences.length === 0) {
      return 'Select audiences...';
    }
    if (this.selectedAudiences.length === 1) {
      const option = this.getAudienceOption(this.selectedAudiences[0]);
      return option ? option.label : this.selectedAudiences[0];
    }
    return `${this.selectedAudiences.length} selected`;
  }
}