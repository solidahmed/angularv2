import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-category-manager',
  templateUrl: './form-category-manager.component.html',
  styleUrls: ['./form-category-manager.component.scss']
})
export class FormCategoryManagerComponent {
  @Input() selectedCategory: string = '';
  @Input() canSaveToLibrary: boolean = true;
  @Input() readOnly: boolean = false;
  
  @Output() categoryChange = new EventEmitter<string>();
  @Output() saveToLibrary = new EventEmitter<void>();
  
  newCategoryControl = new FormControl('', [Validators.required]);
  isAddingCategory = false;
  
  defaultCategories = [
    "General Forms",
    "Contact Forms", 
    "Survey Forms",
    "Registration Forms",
    "Feedback Forms",
    "Application Forms",
    "Vendor Risk Assessment",
    "Security Assessment",
    "Compliance Forms",
    "HR Forms",
    "Customer Onboarding",
    "Others"
  ];
  
  customCategories: string[] = [];
  
  constructor(private dialog: MatDialog) {}
  
  get allCategories(): string[] {
    return [...this.defaultCategories, ...this.customCategories];
  }
  
  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.categoryChange.emit(category);
  }
  
  onSaveToLibrary(): void {
    this.saveToLibrary.emit();
  }
  
  openAddCategoryDialog(): void {
    this.isAddingCategory = true;
  }
  
  closeAddCategoryDialog(): void {
    this.isAddingCategory = false;
    this.newCategoryControl.reset();
  }
  
  addNewCategory(): void {
    if (this.newCategoryControl.invalid) return;
    
    const newCategory = this.newCategoryControl.value?.trim();
    if (newCategory && !this.allCategories.includes(newCategory)) {
      this.customCategories.push(newCategory);
      this.onCategoryChange(newCategory);
      this.closeAddCategoryDialog();
    }
  }
}