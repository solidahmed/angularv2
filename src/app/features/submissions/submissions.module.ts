import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Shared Module
import { SharedModule } from '../../shared/shared.module';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';

// Components
import { SubmissionReviewComponent } from './submission-review/submission-review.component';
import { SubmissionsListComponent } from './submissions-list/submissions-list.component';
import { SubmissionCardComponent } from './submission-card/submission-card.component';
import { SubmissionDetailsComponent } from './submission-details/submission-details.component';
import { SubmissionActionsComponent } from './submission-actions/submission-actions.component';
import { SubmissionsRoutingModule } from './submissions-routing.module';

@NgModule({
  declarations: [
    SubmissionReviewComponent,
    SubmissionsListComponent,
    SubmissionCardComponent,
    SubmissionDetailsComponent,
    SubmissionActionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    SubmissionsRoutingModule,
    
    // Material Modules
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    MatBadgeModule,
    MatChipsModule,
    MatExpansionModule
  ],
  exports: [
    SubmissionReviewComponent
  ]
})
export class SubmissionsModule { }