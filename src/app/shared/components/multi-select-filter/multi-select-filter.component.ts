@@ .. @@
-import { Component, Input, Output, EventEmitter } from '@angular/core';
-import { CommonModule } from '@angular/common';
-import { FormsModule } from '@angular/forms';
-import { MatCheckboxModule } from '@angular/material/checkbox';
-import { MatButtonModule } from '@angular/material/button';
-import { MatIconModule } from '@angular/material/icon';
-import { MatBadgeModule } from '@angular/material/badge';
-import { MatChipsModule } from '@angular/material/chips';
-import { MatMenuModule } from '@angular/material/menu';
-
-@Component({
-  selector: 'app-multi-select-filter',
-  standalone: true,
-  imports: [
-    CommonModule,
-    FormsModule,
-    MatCheckboxModule,
-    MatButtonModule,
-    MatIconModule,
-    MatBadgeModule,
-    MatChipsModule,
-    MatMenuModule
-  ],
-  templateUrl: './multi-select-filter.component.html',
-  styleUrls: ['./multi-select-filter.component.scss']
-})
-export class MultiSelectFilterComponent {
-  @Input() options: string[] = [];
-  @Input() selectedValues: string[] = [];
-  @Input() placeholder: string = 'Select options...';
-  @Input() formatLabel?: (value: string) => string;
-  @Input() showCounts: boolean = false;
-  @Input() getCounts?: (value: string) => number;
-
-  @Output() selectionChange = new EventEmitter<string[]>();
-
-  isOpen = false;
-
-  toggleValue(value: string): void {
-    if (value === 'all') {
-      this.selectionChange.emit([]);
-      return;
-    }
-    
-    if (this.selectedValues.includes(value)) {
-      this.selectionChange.emit(this.selectedValues.filter(v => v !== value));
-    } else {
-      this.selectionChange.emit([...this.selectedValues, value]);
-    }
-  }
-
-  removeValue(value: string, event: MouseEvent): void {
-    event.stopPropagation();
-    this.selectionChange.emit(this.selectedValues.filter(v => v !== value));
-  }
-
-  formatOptionLabel(option: string): string {
-    if (this.formatLabel) {
-      return this.formatLabel(option);
-    }
-    
-    switch (option) {
-      case 'all': return 'All';
-      case 'vendor-risk': return 'Vendor Risk';
-      case 'external-assessment': return 'External Assessment';
-      case 'hr': return 'HR';
-      case 'it': return 'IT';
-      case 'sme': return 'SME';
-      case 'telecom': return 'Telecom';
-      case 'multi-sector': return 'Multi-Sector';
-      case 'multi-category': return 'Multi-Category';
-      case 'other': return 'Other';
-      default: return option.charAt(0).toUpperCase() + option.slice(1);
-    }
-  }
-
-  getDisplayText(): string {
-    if (this.selectedValues.length === 0) {
-      return this.placeholder;
-    }
-    if (this.selectedValues.length === 1) {
-      return this.formatOptionLabel(this.selectedValues[0]);
-    }
-    return `${this.selectedValues.length} selected`;
-  }
-}
+// This component has been moved to the forms feature module
+// Import from @app/features/forms/components/multi-select-filter/multi-select-filter.component
+export { MultiSelectFilterComponent } from '@app/features/forms/components/multi-select-filter/multi-select-filter.component';