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
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Components
import { AnalyticsDashboardComponent } from './analytics-dashboard/analytics-dashboard.component';
import { EmailTrackingComponent } from './email-tracking/email-tracking.component';
import { AnalyticsRoutingModule } from './analytics-routing.module';

@NgModule({
  declarations: [
    AnalyticsDashboardComponent,
    EmailTrackingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    AnalyticsRoutingModule,
    NgChartsModule,
    
    // Material Modules
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatBadgeModule,
    MatProgressBarModule
  ],
  exports: [
    AnalyticsDashboardComponent,
    EmailTrackingComponent
  ]
})
export class AnalyticsModule { }