import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Form, FormTemplate } from '@app/models/form.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrl = '/api/forms'; // Would be replaced with actual API URL
  
  // Sample data for development
  private sampleForms: Form[] = [
    {
      id: 'form-001',
      title: 'Vendor Risk Assessment',
      description: 'Comprehensive vendor risk assessment form for evaluating third-party vendors',
      fields: [],
      settings: {
        allowMultipleSubmissions: false,
        requireLogin: true,
        showProgressBar: true,
        theme: 'light',
        scoring: {
          enabled: true,
          maxTotalPoints: 100,
          showScoreToUser: false,
          passingScore: 70,
          riskThresholds: {
            low: 80,
            medium: 60,
            high: 40
          }
        }
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-01'),
      status: 'published',
      submissions: 45,
      analytics: {
        views: 120,
        submissions: 45,
        completionRate: 37.5,
        emailsSent: 80,
        emailsCompleted: 45,
        averageCompletionTime: 15,
        dropoffRate: 25
      }
    },
    {
      id: 'form-002',
      title: 'Employee Onboarding',
      description: 'New employee information collection and onboarding process',
      fields: [],
      settings: {
        allowMultipleSubmissions: false,
        requireLogin: false,
        showProgressBar: true,
        theme: 'light'
      },
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
      status: 'draft',
      submissions: 0,
      analytics: {
        views: 0,
        submissions: 0,
        completionRate: 0,
        emailsSent: 0,
        emailsCompleted: 0,
        averageCompletionTime: 0,
        dropoffRate: 0
      }
    }
  ];

  constructor(private http: HttpClient) {}

  getForms(): Observable<Form[]> {
    // For development, return sample data
    return of(this.sampleForms);
    
    // In production, would use:
    // return this.http.get<Form[]>(this.apiUrl);
  }

  getForm(id: string): Observable<Form> {
    const form = this.sampleForms.find(f => f.id === id);
    if (form) {
      return of(form);
    }
    
    // In production, would use:
    // return this.http.get<Form>(`${this.apiUrl}/${id}`);
    
    // For development, return a default form if not found
    return of({
      id: 'new-form',
      title: 'Untitled Form',
      description: '',
      fields: [],
      settings: {
        allowMultipleSubmissions: false,
        requireLogin: false,
        showProgressBar: true,
        theme: 'light'
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
      submissions: 0,
      analytics: {
        views: 0,
        submissions: 0,
        completionRate: 0,
        emailsSent: 0,
        emailsCompleted: 0,
        averageCompletionTime: 0,
        dropoffRate: 0
      }
    });
  }

  createForm(form: Partial<Form>): Observable<Form> {
    // In production, would use:
    // return this.http.post<Form>(this.apiUrl, form);
    
    // For development, simulate creating a form
    const newForm: Form = {
      ...form as Form,
      id: `form-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
      submissions: 0,
      analytics: {
        views: 0,
        submissions: 0,
        completionRate: 0,
        emailsSent: 0,
        emailsCompleted: 0,
        averageCompletionTime: 0,
        dropoffRate: 0
      }
    };
    
    this.sampleForms.push(newForm);
    return of(newForm);
  }

  updateForm(id: string, updates: Partial<Form>): Observable<Form> {
    // In production, would use:
    // return this.http.put<Form>(`${this.apiUrl}/${id}`, updates);
    
    // For development, simulate updating a form
    const index = this.sampleForms.findIndex(f => f.id === id);
    if (index !== -1) {
      const updatedForm = {
        ...this.sampleForms[index],
        ...updates,
        updatedAt: new Date()
      };
      this.sampleForms[index] = updatedForm;
      return of(updatedForm);
    }
    
    return this.createForm(updates);
  }

  deleteForm(id: string): Observable<void> {
    // In production, would use:
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    
    // For development, simulate deleting a form
    const index = this.sampleForms.findIndex(f => f.id === id);
    if (index !== -1) {
      this.sampleForms.splice(index, 1);
    }
    return of(undefined);
  }

  publishForm(id: string): Observable<Form> {
    // In production, would use:
    // return this.http.post<Form>(`${this.apiUrl}/${id}/publish`, {});
    
    // For development, simulate publishing a form
    const index = this.sampleForms.findIndex(f => f.id === id);
    if (index !== -1) {
      const publishedForm = {
        ...this.sampleForms[index],
        status: 'published' as const,
        updatedAt: new Date()
      };
      this.sampleForms[index] = publishedForm;
      return of(publishedForm);
    }
    
    return of({} as Form);
  }

  moveToDraft(id: string): Observable<Form> {
    // In production, would use:
    // return this.http.post<Form>(`${this.apiUrl}/${id}/unpublish`, {});
    
    // For development, simulate moving to draft
    const index = this.sampleForms.findIndex(f => f.id === id);
    if (index !== -1) {
      const draftForm = {
        ...this.sampleForms[index],
        status: 'draft' as const,
        updatedAt: new Date()
      };
      this.sampleForms[index] = draftForm;
      return of(draftForm);
    }
    
    return of({} as Form);
  }

  getTemplates(): Observable<FormTemplate[]> {
    // In production, would use:
    // return this.http.get<FormTemplate[]>(`${this.apiUrl}/templates`);
    
    // For development, return sample templates
    return of([
      {
        id: 'template-001',
        name: 'Vendor Risk Assessment',
        description: 'Comprehensive vendor risk assessment template',
        category: 'vendor-risk',
        sector: ['government', 'insurance', 'fintech'],
        targetAudience: ['vendor'],
        fields: [],
        preview: 'assets/templates/vendor-risk.jpg',
        riskCategories: ['security', 'compliance', 'financial', 'operational'],
        scoringModel: 'weighted'
      },
      {
        id: 'template-002',
        name: 'Employee Onboarding',
        description: 'New employee information collection',
        category: 'hr',
        sector: ['all'],
        targetAudience: ['internal'],
        fields: [],
        preview: 'assets/templates/employee-onboarding.jpg'
      },
      {
        id: 'template-003',
        name: 'Customer Feedback',
        description: 'Customer satisfaction survey',
        category: 'feedback',
        sector: ['all'],
        targetAudience: ['external'],
        fields: [],
        preview: 'assets/templates/customer-feedback.jpg'
      }
    ]);
  }
}