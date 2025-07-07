import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';

// Shared Module
import { SharedModule } from '../../shared/shared.module';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Components
import { ReportGenerationComponent } from './report-generation/report-generation.component';
import { ReportChartsComponent } from './report-charts/report-charts.component';
import { ReportCustomizationComponent } from './report-customization/report-customization.component';
import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
  declarations: [
    ReportGenerationComponent,
    ReportChartsComponent,
    ReportCustomizationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    ReportsRoutingModule,
    NgChartsModule,
    
    // Material Modules
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    ReportGenerationComponent,
    ReportChartsComponent
  ]
})
export class ReportsModule { }