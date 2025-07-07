import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FormSubmission } from '@app/models/form.model';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private apiUrl = '/api/submissions'; // Would be replaced with actual API URL
  
  // Sample data for development
  private sampleSubmissions: FormSubmission[] = [
    {
      id: "sub-001",
      formId: "form-vendor-assessment",
      submittedBy: "Sarah Johnson",
      submitterEmail: "sarah.johnson@techcorp.com",
      submitterName: "Sarah Johnson",
      companyName: "TechCorp Solutions",
      submissionType: "vendor",
      submittedAt: new Date("2024-01-15T10:30:00Z"),
      status: "approved",
      approvalType: "fully",
      responses: {
        "company_name": "TechCorp Solutions",
        "business_type": "Technology Services",
        "annual_revenue": "$5M - $10M",
        "employee_count": "50-100",
        "data_security_measures": "ISO 27001 certified, SOC 2 Type II compliant",
        "compliance_certifications": ["ISO 27001", "SOC 2", "GDPR"],
        "previous_incidents": "None in the past 3 years",
        "insurance_coverage": "$2M Cyber Liability Insurance",
        "references": [
          { company: "Global Finance Corp", contact: "mike.chen@globalfinance.com" },
          { company: "Healthcare Plus", contact: "lisa.wong@healthcareplus.com" }
        ]
      },
      score: {
        total: 92,
        maxTotal: 100,
        percentage: 92,
        riskLevel: "low",
        reviewedBy: "John Reviewer",
        reviewedAt: new Date("2024-01-16T09:00:00Z"),
        reviewComments: "Excellent security posture and compliance. Strong references. Approved for partnership.",
        breakdown: {
          security: 95,
          compliance: 90,
          financial: 88,
          operational: 94
        }
      },
      activityLog: [
        {
          id: "act-001",
          action: "approved",
          comments: "Excellent security posture and compliance. Strong references. Approved for partnership.",
          reviewedBy: "John Reviewer",
          reviewedAt: new Date("2024-01-16T09:00:00Z")
        }
      ],
      attachments: [
        {
          id: "att-001",
          name: "ISO_27001_Certificate.pdf",
          url: "/documents/iso-cert.pdf",
          size: 245760,
          type: "application/pdf",
          uploadedAt: new Date("2024-01-15T10:25:00Z")
        },
        {
          id: "att-002", 
          name: "SOC2_Report.pdf",
          url: "/documents/soc2-report.pdf",
          size: 512000,
          type: "application/pdf",
          uploadedAt: new Date("2024-01-15T10:26:00Z")
        }
      ]
    },
    {
      id: "sub-002",
      formId: "form-vendor-assessment",
      submittedBy: "Marcus Rodriguez",
      submitterEmail: "marcus@startupventures.io",
      submitterName: "Marcus Rodriguez",
      companyName: "StartupVentures Inc",
      submissionType: "vendor",
      submittedAt: new Date("2024-01-20T14:15:00Z"),
      status: "under_review",
      responses: {
        "company_name": "StartupVentures Inc",
        "business_type": "Software Development",
        "annual_revenue": "$1M - $5M",
        "employee_count": "10-25",
        "data_security_measures": "Basic security protocols, working towards SOC 2",
        "compliance_certifications": ["GDPR"],
        "previous_incidents": "Minor data breach resolved in 2023",
        "insurance_coverage": "$500K Professional Liability",
        "references": [
          { company: "Local Bank", contact: "jane.doe@localbank.com" }
        ]
      },
      score: {
        total: 68,
        maxTotal: 100,
        percentage: 68,
        riskLevel: "medium",
        reviewedBy: "Sarah Analyst",
        reviewedAt: new Date("2024-01-21T10:30:00Z"),
        reviewComments: "Adequate for small partnership. Recommend security improvements before larger engagement.",
        breakdown: {
          security: 60,
          compliance: 70,
          financial: 72,
          operational: 70
        }
      },
      activityLog: [
        {
          id: "act-002",
          action: "under_review",
          comments: "Adequate for small partnership. Recommend security improvements before larger engagement.",
          reviewedBy: "Sarah Analyst",
          reviewedAt: new Date("2024-01-21T10:30:00Z")
        }
      ],
      attachments: [
        {
          id: "att-003",
          name: "Company_Profile.pdf",
          url: "/documents/company-profile.pdf",
          size: 156000,
          type: "application/pdf",
          uploadedAt: new Date("2024-01-20T14:10:00Z")
        }
      ]
    },
    {
      id: "sub-003",
      formId: "form-vendor-assessment",
      submittedBy: "Amanda Chen",
      submitterEmail: "a.chen@globalsecure.com",
      submitterName: "Amanda Chen",
      companyName: "GlobalSecure Systems",
      submissionType: "vendor",
      submittedAt: new Date("2024-01-25T09:45:00Z"),
      status: "approved",
      approvalType: "fully",
      responses: {
        "company_name": "GlobalSecure Systems",
        "business_type": "Cybersecurity Services",
        "annual_revenue": "$25M+",
        "employee_count": "500+",
        "data_security_measures": "Multi-layered security, zero-trust architecture, 24/7 SOC",
        "compliance_certifications": ["ISO 27001", "SOC 2", "FedRAMP", "PCI DSS"],
        "previous_incidents": "No security incidents reported",
        "insurance_coverage": "$10M Cyber Liability + Errors & Omissions",
        "references": [
          { company: "Fortune 500 Bank", contact: "secure@fortune500bank.com" },
          { company: "Government Agency", contact: "procurement@gov.agency" },
          { company: "Healthcare Network", contact: "ciso@healthnet.org" }
        ]
      },
      score: {
        total: 98,
        maxTotal: 100,
        percentage: 98,
        riskLevel: "low",
        reviewedBy: "John Reviewer",
        reviewedAt: new Date("2024-01-26T08:15:00Z"),
        reviewComments: "Premium vendor with exceptional security posture. Highly recommended for critical projects.",
        breakdown: {
          security: 100,
          compliance: 98,
          financial: 95,
          operational: 99
        }
      },
      activityLog: [
        {
          id: "act-003",
          action: "approved", 
          comments: "Premium vendor with exceptional security posture. Highly recommended for critical projects.",
          reviewedBy: "John Reviewer",
          reviewedAt: new Date("2024-01-26T08:15:00Z")
        }
      ],
      attachments: [
        {
          id: "att-004",
          name: "FedRAMP_Authorization.pdf",
          url: "/documents/fedramp-auth.pdf",
          size: 890000,
          type: "application/pdf",
          uploadedAt: new Date("2024-01-25T09:40:00Z")
        },
        {
          id: "att-005",
          name: "Security_Architecture.pdf",
          url: "/documents/security-arch.pdf",
          size: 1200000,
          type: "application/pdf",
          uploadedAt: new Date("2024-01-25T09:42:00Z")
        }
      ]
    }
  ];

  constructor(private http: HttpClient) {}

  getSubmissions(): Observable<FormSubmission[]> {
    // For development, return sample data
    return of(this.sampleSubmissions);
    
    // In production, would use:
    // return this.http.get<FormSubmission[]>(this.apiUrl);
  }

  getSubmission(id: string): Observable<FormSubmission> {
    const submission = this.sampleSubmissions.find(s => s.id === id);
    if (submission) {
      return of(submission);
    }
    
    // In production, would use:
    // return this.http.get<FormSubmission>(`${this.apiUrl}/${id}`);
    
    // For development, return a default submission if not found
    return of({} as FormSubmission);
  }

  updateSubmission(id: string, updates: Partial<FormSubmission>): Observable<FormSubmission> {
    // In production, would use:
    // return this.http.put<FormSubmission>(`${this.apiUrl}/${id}`, updates);
    
    // For development, simulate updating a submission
    const index = this.sampleSubmissions.findIndex(s => s.id === id);
    if (index !== -1) {
      const updatedSubmission = {
        ...this.sampleSubmissions[index],
        ...updates
      };
      this.sampleSubmissions[index] = updatedSubmission;
      return of(updatedSubmission);
    }
    
    return of({} as FormSubmission);
  }

  updateSubmissionStatus(id: string, status: string, comments: string): Observable<FormSubmission> {
    // In production, would use:
    // return this.http.put<FormSubmission>(`${this.apiUrl}/${id}/status`, { status, comments });
    
    // For development, simulate updating submission status
    return this.updateSubmission(id, { 
      status: status as any,
      activityLog: [
        ...(this.sampleSubmissions.find(s => s.id === id)?.activityLog || []),
        {
          id: `act-${Date.now()}`,
          action: status as any,
          comments,
          reviewedBy: 'Current User',
          reviewedAt: new Date()
        }
      ]
    });
  }
}