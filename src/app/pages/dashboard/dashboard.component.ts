import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormSubmission, Form } from '@app/models/form.model';
import { FormService } from '@app/services/form.service';
import { SubmissionService } from '@app/services/submission.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  activeTab = 'dashboard';
  activeBuildTab = 'builder';
  submissions: FormSubmission[] = [];
  savedDrafts: Form[] = [];
  publishedForms: Form[] = [];
  submissionFilters: any = {};
  
  constructor(
    private router: Router,
    private formService: FormService,
    private submissionService: SubmissionService
  ) {}
  
  ngOnInit(): void {
    this.loadSubmissions();
    this.loadForms();
  }
  
  private loadSubmissions(): void {
    this.submissionService.getSubmissions().subscribe(submissions => {
      this.submissions = submissions;
    });
  }
  
  private loadForms(): void {
    this.formService.getForms().subscribe(forms => {
      this.savedDrafts = forms.filter(form => form.status === 'draft');
      this.publishedForms = forms.filter(form => form.status === 'published');
    });
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  setActiveBuildTab(tab: string): void {
    this.activeBuildTab = tab;
  }
  
  handleFilterSubmissions(filters: any): void {
    this.submissionFilters = filters;
    this.activeTab = 'review-submissions';
  }
  
  createNewForm(): void {
    this.router.navigate(['/forms/new']);
  }
  
  loadForm(form: Form): void {
    this.router.navigate(['/forms', form.id]);
  }
  
  publishForm(form: Form): void {
    this.formService.publishForm(form.id).subscribe(() => {
      this.loadForms();
    });
  }
  
  moveToDraft(form: Form): void {
    this.formService.moveToDraft(form.id).subscribe(() => {
      this.loadForms();
    });
  }
  
  deleteForm(form: Form): void {
    this.formService.deleteForm(form.id).subscribe(() => {
      this.loadForms();
    });
  }
  
  updateSubmission(data: { submissionId: string, updates: Partial<FormSubmission> }): void {
    this.submissionService.updateSubmission(data.submissionId, data.updates).subscribe(() => {
      this.loadSubmissions();
    });
  }
}