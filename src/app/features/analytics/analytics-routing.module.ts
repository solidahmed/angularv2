import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsDashboardComponent } from './analytics-dashboard/analytics-dashboard.component';
import { EmailTrackingComponent } from './email-tracking/email-tracking.component';

const routes: Routes = [
  { path: '', component: AnalyticsDashboardComponent },
  { path: 'email-tracking', component: EmailTrackingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }