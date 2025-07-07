import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-multi-select-category',
  templateUrl: './multi-select-category.component.html',
  styleUrls: ['./multi-select-category.component.scss']
})
export class MultiSelectCategoryComponent {
  @Input() selectedCategories: string[] = [];
  @Input() disabled = false;
  @Output() categoryChange = new EventEmitter<string[]>();
  
  categoryControl = new FormControl();
  panelOpen = false;
  
  categoryOptions = [
    "survey", "assessment", "registration", "feedback", "compliance", 
    "risk", "vendor-risk", "external-assessment", "hr", "customer", 
    "finance", "it", "security", "quality", "operations", "procurement", 
    "marketing", "sales", "project", "training", "legal", "audit", "business"
  ];
  
  constructor() {}
  
  toggleCategory(category: string): void {
    if (this.disabled) return;
    
    const index = this.selectedCategories.indexOf(category);
    if (index === -1) {
      this.selectedCategories = [...this.selectedCategories, category];
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }
    
    this.categoryChange.emit(this.selectedCategories);
  }
  
  removeCategory(category: string, event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled) return;
    
    this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    this.categoryChange.emit(this.selectedCategories);
  }
  
  formatCategoryLabel(category: string): string {
    switch (category) {
      case "vendor-risk": return "Vendor Risk";
      case "external-assessment": return "External Assessment";
      case "hr": return "HR";
      case "it": return "IT";
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  }
  
  getDisplayText(): string {
    if (this.selectedCategories.length === 0) {
      return 'Select categories...';
    }
    if (this.selectedCategories.length === 1) {
      return this.formatCategoryLabel(this.selectedCategories[0]);
    }
    return `${this.selectedCategories.length} selected`;
  }
}