import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubmissionReviewComponent } from './submission-review/submission-review.component';

const routes: Routes = [
  { path: '', component: SubmissionReviewComponent },
  { path: ':id', component: SubmissionReviewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmissionsRoutingModule { }