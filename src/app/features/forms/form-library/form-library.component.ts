import { Component, OnInit } from '@angular/core';
import { FormTemplate } from '../../../models/form.model';
import { FormService } from '../../../services/form.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormService } from '@app/services/form.service';

@Component({
  selector: 'app-form-library',
  templateUrl: './form-library.component.html',
  styleUrls: ['./form-library.component.scss']
  templateUrl: './form-library.component.html',
  styleUrls: ['./form-library.component.scss']
})
export class FormLibraryComponent implements OnInit {
  @Output() onUseTemplate = new EventEmitter<FormTemplate>();
  
  templates: FormTemplate[] = [];
  filteredTemplates: FormTemplate[] = [];
  
  // Filters
  selectedCategories: string[] = [];
  selectedSectors: string[] = [];
  searchTerm: string = '';
  
  constructor(
    private formService: FormService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.loadTemplates();
  }
  
  loadTemplates(): void {
    this.formService.getTemplates().subscribe(
      templates => {
        this.templates = templates;
        this.filteredTemplates = [...templates];
      },
      error => {
        console.error('Error loading templates:', error);
      }
    );
  }
  templates: FormTemplate[] = [];
  filteredTemplates: FormTemplate[] = [];
  
  // Filters
  selectedCategories: string[] = [];
  selectedSectors: string[] = [];
  searchTerm: string = '';
  
  // Categories and sectors for filtering
  categories = [
    "all", "survey", "assessment", "registration", "feedback", "compliance", 
    "risk", "vendor-risk", "external-assessment", "hr", "customer", 
    "finance", "it", "security", "quality", "operations", "procurement", 
    "marketing", "sales", "project", "training", "legal", "audit", "business",
    "multi-category", "other"
  ];
  
  sectors = [
    "all", "government", "insurance", "fintech", "healthcare", "energy", 
    "telecom", "startups", "sme", "multi-sector", "other"
  ];
  
  constructor(
    private formService: FormService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.formService.getTemplates().subscribe(
      templates => {
        // In a real app, we'd have more templates
        // For demo purposes, let's create a larger set
        this.templates = this.generateDemoTemplates();
        this.applyFilters();
      },
      error => {
        console.error('Error loading templates:', error);
        this.snackBar.open('Error loading templates', 'Close', {
          duration: 3000
        });
      }
    );
  }
  
  generateDemoTemplates(): FormTemplate[] {
    const demoTemplates: FormTemplate[] = [];
    
    // Generate templates for each sector
    for (const sector of this.sectors.filter(s => s !== 'all' && s !== 'multi-sector' && s !== 'other')) {
      for (let i = 1; i <= 3; i++) {
        demoTemplates.push({
          id: `${sector}-${i}`,
          name: `${this.formatSectorName(sector)} ${this.getCategoryName(i)} Template`,
          description: `Standard ${this.formatSectorName(sector)} ${this.getCategoryName(i)} form for compliance and risk assessment`,
          category: this.getCategoryValue(i),
          sector: sector,
          targetAudience: this.getTargetAudience(i),
          fields: []
        });
      }
    }
    
    // Add some multi-sector templates
    demoTemplates.push({
      id: 'multi-sector-1',
      name: 'Universal Compliance Checklist',
      description: 'Comprehensive compliance checklist applicable across multiple sectors',
      category: 'compliance',
      sector: ['government', 'fintech', 'healthcare', 'energy'],
      targetAudience: ['vendor', 'internal'],
      fields: []
    });
    
    demoTemplates.push({
      id: 'multi-sector-2',
      name: 'General Vendor Assessment',
      description: 'Standard vendor risk assessment applicable to all industries',
      category: 'vendor-risk',
      sector: 'all',
      targetAudience: ['vendor'],
      fields: []
    });
    
    return demoTemplates;
  }
  
  getCategoryName(index: number): string {
    switch (index % 3) {
      case 0: return 'Risk Assessment';
      case 1: return 'Compliance';
      case 2: return 'Onboarding';
      default: return 'Form';
    }
  }
  
  getCategoryValue(index: number): string {
    switch (index % 3) {
      case 0: return 'risk';
      case 1: return 'compliance';
      case 2: return 'onboarding';
      default: return 'general';
    }
  }
  
  getTargetAudience(index: number): string[] {
    switch (index % 3) {
      case 0: return ['vendor'];
      case 1: return ['internal'];
      case 2: return ['external'];
      default: return ['vendor', 'internal'];
    }
  }
  
  formatSectorName(sector: string): string {
    switch (sector) {
      case 'sme': return 'SME';
      default: return sector.charAt(0).toUpperCase() + sector.slice(1);
    }
  }
  
  applyFilters(): void {
    this.filteredTemplates = this.templates.filter(template => {
      // Category filter
      if (this.selectedCategories.length > 0 && !this.selectedCategories.includes('all')) {
        const templateCategories = Array.isArray(template.category) 
          ? template.category 
          : [template.category];
        
        if (!this.selectedCategories.some(cat => templateCategories.includes(cat))) {
          return false;
        }
      }
      
      // Sector filter
      if (this.selectedSectors.length > 0 && !this.selectedSectors.includes('all')) {
        const templateSectors = Array.isArray(template.sector) 
          ? template.sector 
          : [template.sector as string];
        
        if (!this.selectedSectors.some(sector => templateSectors.includes(sector) || templateSectors.includes('all'))) {
          return false;
        }
      }
      
      // Search term filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return template.name.toLowerCase().includes(searchLower) || 
               template.description.toLowerCase().includes(searchLower);
      }
      
      return true;
    });
  }
  
  updateCategoryFilter(categories: string[]): void {
    this.selectedCategories = categories;
    this.applyFilters();
  }
  
  updateSectorFilter(sectors: string[]): void {
    this.selectedSectors = sectors;
    this.applyFilters();
  }
  
  onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }
  
  useTemplate(template: FormTemplate): void {
    this.onUseTemplate.emit(template);
    this.snackBar.open(`Template "${template.name}" applied successfully`, 'Close', {
      duration: 3000
    });
  }
  
  getCategoryCount(category: string): number {
    return this.templates.filter(t => {
      const templateCategories = Array.isArray(t.category) ? t.category : [t.category];
      return templateCategories.includes(category);
    }).length;
  }
  
  getSectorCount(sector: string): number {
    return this.templates.filter(t => {
      const templateSectors = Array.isArray(t.sector) ? t.sector : [t.sector as string];
      return templateSectors.includes(sector) || templateSectors.includes('all');
    });
  }
}