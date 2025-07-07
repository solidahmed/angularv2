import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { 
    path: 'forms', 
    loadChildren: () => import('./features/forms/forms.module').then(m => m.FormsModule) 
  },
  { 
    path: 'submissions', 
    loadChildren: () => import('./features/submissions/submissions.module').then(m => m.SubmissionsModule) 
  },
  { 
    path: 'reports', 
    loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule) 
  },
  { 
    path: 'analytics', 
    loadChildren: () => import('./features/analytics/analytics.module').then(m => m.AnalyticsModule) 
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }