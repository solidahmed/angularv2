# Form Builder & Submission Management API Documentation

## Overview
This document outlines the complete API specification and database schema for implementing the backend of the Form Builder and Submission Management system using .NET Core Web API. The system supports comprehensive form creation, email distribution, submission management, and advanced analytics with PDF export capabilities.

## Current System Features
- **Advanced Form Builder**: Drag-and-drop interface with 15+ field types, conditional logic, and real-time preview
- **Comprehensive Template Library**: 169 industry-specific templates across 8 sectors with advanced filtering
- **AI-Enhanced Email Campaigns**: Intelligent email optimization, automated reminders, and engagement tracking
- **AI-Powered Submission Processing**: Machine learning-based scoring, approval recommendations, and automated workflows
- **Advanced Analytics & Reporting**: Real-time dashboards with predictive insights, PDF/Excel export, and trend analysis
- **Secure Document Management**: File attachments with virus scanning, cloud storage integration, and version control
- **Intelligent Review System**: AI-assisted approval workflows with Fully/Partially Approved classifications
- **Multi-Select Filtering**: Advanced template and submission filtering with real-time counts and smart categorization

## Technology Stack
- **Framework**: .NET 8 Web API
- **Database**: SQL Server / PostgreSQL
- **ORM**: Entity Framework Core
- **Authentication**: JWT Bearer Token
- **File Storage**: Azure Blob Storage / AWS S3
- **Email Service**: SendGrid / SMTP

## Database Schema

### 1. Users Table
```sql
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Name NVARCHAR(255) NOT NULL,
    PasswordHash NVARCHAR(500) NOT NULL,
    Role NVARCHAR(50) NOT NULL DEFAULT 'User', -- Admin, User, Reviewer
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsActive BIT NOT NULL DEFAULT 1
);
```

### 2. Forms Table
```sql
CREATE TABLE Forms (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title NVARCHAR(500) NOT NULL,
    Description NTEXT,
    Status NVARCHAR(20) NOT NULL DEFAULT 'draft', -- draft, published
    CreatedBy UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    SubmissionCount INT NOT NULL DEFAULT 0,
    
    -- Settings (JSON stored as NVARCHAR(MAX))
    Settings NVARCHAR(MAX), -- JSON: allowMultipleSubmissions, requireLogin, etc.
    
    -- Analytics (JSON stored as NVARCHAR(MAX))
    Analytics NVARCHAR(MAX), -- JSON: views, submissions, completionRate, etc.
    
    INDEX IX_Forms_CreatedBy (CreatedBy),
    INDEX IX_Forms_Status (Status)
);
```

### 3. FormFields Table
```sql
CREATE TABLE FormFields (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    FormId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Forms(Id) ON DELETE CASCADE,
    FieldType NVARCHAR(50) NOT NULL, -- text, email, number, select, checkbox, etc.
    Label NVARCHAR(500) NOT NULL,
    IsRequired BIT NOT NULL DEFAULT 0,
    OrderIndex INT NOT NULL,
    DefaultValue NVARCHAR(MAX),
    Placeholder NVARCHAR(500),
    Description NTEXT,
    ValidationRegex NVARCHAR(500),
    ErrorMessage NVARCHAR(500),
    Weightage DECIMAL(5,2) DEFAULT 0,
    
    -- Options for select/radio fields (JSON array)
    Options NVARCHAR(MAX),
    
    -- Scoring configuration (JSON)
    ScoringConfig NVARCHAR(MAX),
    
    -- Validation rules (JSON)
    ValidationRules NVARCHAR(MAX),
    
    INDEX IX_FormFields_FormId (FormId),
    INDEX IX_FormFields_OrderIndex (OrderIndex)
);
```

### 4. FormTemplates Table
```sql
CREATE TABLE FormTemplates (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(255) NOT NULL,
    Description NTEXT,
    Category NVARCHAR(100) NOT NULL,
    PreviewUrl NVARCHAR(500),
    RiskCategories NVARCHAR(MAX), -- JSON array
    ScoringModel NVARCHAR(100),
    CreatedBy UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsActive BIT NOT NULL DEFAULT 1,
    
    INDEX IX_FormTemplates_Category (Category)
);
```

### 5. FormTemplateFields Table
```sql
CREATE TABLE FormTemplateFields (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TemplateId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES FormTemplates(Id) ON DELETE CASCADE,
    FieldType NVARCHAR(50) NOT NULL,
    Label NVARCHAR(500) NOT NULL,
    IsRequired BIT NOT NULL DEFAULT 0,
    OrderIndex INT NOT NULL,
    DefaultValue NVARCHAR(MAX),
    Placeholder NVARCHAR(500),
    Description NTEXT,
    Options NVARCHAR(MAX), -- JSON array
    ScoringConfig NVARCHAR(MAX), -- JSON
    ValidationRules NVARCHAR(MAX), -- JSON
    
    INDEX IX_FormTemplateFields_TemplateId (TemplateId)
);
```

### 6. FormSubmissions Table
```sql
CREATE TABLE FormSubmissions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    FormId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Forms(Id),
    SubmittedBy UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(Id),
    SubmittedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Status NVARCHAR(50) NOT NULL DEFAULT 'submitted', -- submitted, under_review, approved, rejected
    ApprovalType NVARCHAR(20), -- fully, partially (required when status is approved)
    
    -- Submitter Information
    SubmitterEmail NVARCHAR(255) NOT NULL,
    SubmitterName NVARCHAR(255) NOT NULL,
    CompanyName NVARCHAR(255),
    RecipientId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES EmailRecipients(Id),
    
    -- Classification
    SubmissionType NVARCHAR(20) NOT NULL, -- vendor, internal
    
    -- Performance Metrics
    CompletionPercentage DECIMAL(5,2),
    TimeSpent INT, -- seconds
    
    -- Responses (JSON)
    Responses NVARCHAR(MAX) NOT NULL, -- JSON object with field responses
    
    INDEX IX_FormSubmissions_FormId (FormId),
    INDEX IX_FormSubmissions_Status (Status),
    INDEX IX_FormSubmissions_SubmittedAt (SubmittedAt)
);
```

### 7. SubmissionScores Table
```sql
CREATE TABLE SubmissionScores (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SubmissionId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES FormSubmissions(Id) ON DELETE CASCADE,
    TotalScore DECIMAL(10,2) NOT NULL,
    MaxTotalScore DECIMAL(10,2) NOT NULL,
    Percentage DECIMAL(5,2) NOT NULL,
    RiskLevel NVARCHAR(20) NOT NULL, -- low, medium, high, critical
    RiskScore DECIMAL(5,2),
    ReviewedBy UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    ReviewedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ReviewComments NTEXT,
    
    -- Detailed scoring (JSON)
    CategoryScores NVARCHAR(MAX), -- JSON object
    ScoreBreakdown NVARCHAR(MAX), -- JSON object
    
    INDEX IX_SubmissionScores_SubmissionId (SubmissionId),
    INDEX IX_SubmissionScores_RiskLevel (RiskLevel)
);
```

### 8. ReviewActivities Table
```sql
CREATE TABLE ReviewActivities (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SubmissionId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES FormSubmissions(Id) ON DELETE CASCADE,
    Action NVARCHAR(50) NOT NULL, -- approved, rejected, under_review, resent, reminder_sent, info_requested
    ApprovalType NVARCHAR(20), -- fully, partially (for approved actions)
    AIRecommendation NVARCHAR(MAX), -- JSON: AI suggestion details
    AIConfidenceScore DECIMAL(5,2), -- AI confidence percentage
    HumanOverride BIT DEFAULT 0, -- Whether human overrode AI
    Comments NTEXT,
    ReviewedBy UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    ReviewedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    -- Enhanced metadata (JSON)
    Metadata NVARCHAR(MAX), -- AI analysis, decision reasoning, etc.
    
    INDEX IX_ReviewActivities_SubmissionId (SubmissionId),
    INDEX IX_ReviewActivities_Action (Action),
    INDEX IX_ReviewActivities_ApprovalType (ApprovalType),
    INDEX IX_ReviewActivities_AIConfidenceScore (AIConfidenceScore)
);
```

### 9. DocumentAttachments Table
```sql
CREATE TABLE DocumentAttachments (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SubmissionId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES FormSubmissions(Id) ON DELETE CASCADE,
    FileName NVARCHAR(255) NOT NULL,
    FileType NVARCHAR(50) NOT NULL,
    FileSize BIGINT NOT NULL,
    FileUrl NVARCHAR(1000) NOT NULL,
    UploadedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UploadedBy UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(Id),
    
    INDEX IX_DocumentAttachments_SubmissionId (SubmissionId)
);
```

### 10. EmailRecipients Table
```sql
CREATE TABLE EmailRecipients (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    FormId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Forms(Id) ON DELETE CASCADE,
    Email NVARCHAR(255) NOT NULL,
    Name NVARCHAR(255),
    Status NVARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, sent, opened, completed, expired
    RemindersSent INT NOT NULL DEFAULT 0,
    SentAt DATETIME2,
    CompletedAt DATETIME2,
    LastReminderAt DATETIME2,
    UniqueToken UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(), -- For tracking
    
    INDEX IX_EmailRecipients_FormId (FormId),
    INDEX IX_EmailRecipients_Status (Status),
    INDEX IX_EmailRecipients_UniqueToken (UniqueToken)
);
```

### 11. FormCategories Table
```sql
CREATE TABLE FormCategories (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(255) NOT NULL UNIQUE,
    Description NTEXT,
    Color NVARCHAR(7), -- Hex color code
    Icon NVARCHAR(50), -- Icon name or identifier
    ParentCategoryId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES FormCategories(Id),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsActive BIT NOT NULL DEFAULT 1,
    
    INDEX IX_FormCategories_ParentCategory (ParentCategoryId)
);
```

### 12. FormAnalytics Table
```sql
CREATE TABLE FormAnalytics (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    FormId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Forms(Id) ON DELETE CASCADE,
    EventType NVARCHAR(50) NOT NULL, -- view, start, submit, abandon
    EventData NVARCHAR(MAX), -- JSON with additional event details
    UserAgent NVARCHAR(500),
    IpAddress NVARCHAR(45),
    SessionId NVARCHAR(100),
    EventDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    INDEX IX_FormAnalytics_FormId (FormId),
    INDEX IX_FormAnalytics_EventType (EventType),
    INDEX IX_FormAnalytics_EventDate (EventDate)
);
```

### 13. SystemSettings Table
```sql
CREATE TABLE SystemSettings (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SettingKey NVARCHAR(255) NOT NULL UNIQUE,
    SettingValue NVARCHAR(MAX) NOT NULL,
    Description NTEXT,
    SettingType NVARCHAR(50) NOT NULL, -- string, number, boolean, json
    IsSystem BIT NOT NULL DEFAULT 0, -- System settings vs user configurable
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    INDEX IX_SystemSettings_Key (SettingKey)
);
```

### 14. AuditLogs Table
```sql
CREATE TABLE AuditLogs (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(Id),
    EntityType NVARCHAR(100) NOT NULL, -- Form, Submission, User, etc.
    EntityId UNIQUEIDENTIFIER NOT NULL,
    Action NVARCHAR(50) NOT NULL, -- Create, Update, Delete, View, etc.
    OldValues NVARCHAR(MAX), -- JSON of old values
    NewValues NVARCHAR(MAX), -- JSON of new values
    IPAddress NVARCHAR(45),
    UserAgent NVARCHAR(500),
    Timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    INDEX IX_AuditLogs_EntityType (EntityType),
    INDEX IX_AuditLogs_EntityId (EntityId),
    INDEX IX_AuditLogs_UserId (UserId),
    INDEX IX_AuditLogs_Timestamp (Timestamp)
);
```

## API Endpoints

### Authentication Endpoints

#### GET /api/auth/me
```csharp
// Get current user information
// Response: UserDto with current user details
public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
    public string Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
}
```

#### POST /api/auth/logout
```csharp
// Invalidate current token
// No request body, returns 200 OK
```

#### POST /api/auth/login
```csharp
// Request
public class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}

// Response
public class LoginResponse
{
    public string Token { get; set; }
    public UserDto User { get; set; }
    public DateTime ExpiresAt { get; set; }
}
```

#### POST /api/auth/register
```csharp
// Request
public class RegisterRequest
{
    public string Email { get; set; }
    public string Name { get; set; }
    public string Password { get; set; }
    public string Role { get; set; } = "User";
}
```

#### POST /api/auth/refresh
```csharp
// Request
public class RefreshTokenRequest
{
    public string RefreshToken { get; set; }
}
```

### Form Management Endpoints

#### GET /api/forms
```csharp
// Query Parameters
public class GetFormsQuery
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string Status { get; set; } // draft, published
    public string Search { get; set; }
    public DateTime? CreatedAfter { get; set; }
}

// Response
public class PagedResult<T>
{
    public List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}
```

#### GET /api/forms/{id}
```csharp
// Response: FormDto with complete form data including fields
```

#### POST /api/forms
```csharp
// Request
public class CreateFormRequest
{
    public string Title { get; set; }
    public string Description { get; set; }
    public List<FormFieldDto> Fields { get; set; }
    public FormSettingsDto Settings { get; set; }
}
```

#### PUT /api/forms/{id}
```csharp
// Request: Same as CreateFormRequest
```

#### DELETE /api/forms/{id}
```csharp
// No request body, returns 204 No Content
```

#### POST /api/forms/{id}/publish
```csharp
// No request body, changes status to 'published'
```

#### POST /api/forms/{id}/duplicate
```csharp
// Request
public class DuplicateFormRequest
{
    public string NewTitle { get; set; }
}
```

#### POST /api/forms/{id}/unpublish
```csharp
// No request body, changes status back to 'draft'
```

#### GET /api/forms/{id}/preview
```csharp
// Response: FormDto with preview-specific formatting
```

#### PUT /api/forms/{id}/settings
```csharp
// Request
public class UpdateFormSettingsRequest
{
    public FormSettingsDto Settings { get; set; }
}
```

#### POST /api/forms/{id}/export
```csharp
// Request
public class ExportFormRequest
{
    public string Format { get; set; } // json, xml, pdf
}
// Response: File stream or export data
```

### Form Fields Endpoints

#### GET /api/forms/{formId}/fields
```csharp
// Response: List<FormFieldDto>
```

#### POST /api/forms/{formId}/fields
```csharp
// Request: FormFieldDto
```

#### PUT /api/forms/{formId}/fields/{fieldId}
```csharp
// Request: FormFieldDto
```

#### DELETE /api/forms/{formId}/fields/{fieldId}
```csharp
// No request body
```

#### PUT /api/forms/{formId}/fields/reorder
```csharp
// Request
public class ReorderFieldsRequest
{
    public List<FieldOrderDto> Fields { get; set; }
}

public class FieldOrderDto
{
    public Guid FieldId { get; set; }
    public int OrderIndex { get; set; }
}
```

### Form Templates Endpoints

#### GET /api/templates
```csharp
// Query Parameters
public class GetTemplatesQuery
{
    public string Category { get; set; }
    public string Search { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
```

#### GET /api/templates/{id}
```csharp
// Response: FormTemplateDto
```

#### POST /api/templates
```csharp
// Request: CreateTemplateRequest
```

#### PUT /api/templates/{id}
```csharp
// Request: UpdateTemplateRequest
```

#### DELETE /api/templates/{id}
```csharp
// No request body
```

#### POST /api/templates/{id}/create-form
```csharp
// Request
public class CreateFormFromTemplateRequest
{
    public string Title { get; set; }
    public string Description { get; set; }
}
```

### Form Submissions Endpoints

#### GET /api/submissions
```csharp
// Query Parameters
public class GetSubmissionsQuery
{
    public Guid? FormId { get; set; }
    public string Status { get; set; }
    public string SubmissionType { get; set; }
    public DateTime? SubmittedAfter { get; set; }
    public DateTime? SubmittedBefore { get; set; }
    public string Search { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
```

#### GET /api/submissions/{id}
```csharp
// Response: FormSubmissionDto with complete data
```

#### POST /api/submissions
```csharp
// Request
public class CreateSubmissionRequest
{
    public Guid FormId { get; set; }
    public string SubmitterEmail { get; set; }
    public string SubmitterName { get; set; }
    public string CompanyName { get; set; }
    public string SubmissionType { get; set; }
    public Dictionary<string, object> Responses { get; set; }
    public List<DocumentUploadDto> Attachments { get; set; }
}
```

#### PUT /api/submissions/{id}/status
```csharp
// Request
public class UpdateSubmissionStatusRequest
{
    public string Status { get; set; }
    public string Comments { get; set; }
}
```

#### POST /api/submissions/{id}/score
```csharp
// Request
public class ScoreSubmissionRequest
{
    public decimal TotalScore { get; set; }
    public decimal MaxTotalScore { get; set; }
    public string RiskLevel { get; set; }
    public decimal? RiskScore { get; set; }
    public string ReviewComments { get; set; }
    public Dictionary<string, decimal> CategoryScores { get; set; }
    public Dictionary<string, decimal> ScoreBreakdown { get; set; }
}
```

#### POST /api/submissions/{id}/review
```csharp
// Request
public class AddReviewActivityRequest
{
    public string Action { get; set; }
    public string Comments { get; set; }
    public object Metadata { get; set; }
}
```

### Email Management Endpoints

#### GET /api/forms/{formId}/recipients
```csharp
// Response: List<EmailRecipientDto>
```

#### POST /api/forms/{formId}/recipients
```csharp
// Request
public class AddRecipientsRequest
{
    public List<EmailRecipientDto> Recipients { get; set; }
}
```

#### PUT /api/forms/{formId}/recipients/{recipientId}
```csharp
// Request: EmailRecipientDto
```

#### DELETE /api/forms/{formId}/recipients/{recipientId}
```csharp
// No request body
```

#### POST /api/forms/{formId}/send-invitations
```csharp
// Request
public class SendInvitationsRequest
{
    public List<Guid> RecipientIds { get; set; }
    public string Subject { get; set; }
    public string Message { get; set; }
}
```

#### POST /api/forms/{formId}/send-reminders
```csharp
// Request
public class SendRemindersRequest
{
    public List<Guid> RecipientIds { get; set; }
    public string Subject { get; set; }
    public string Message { get; set; }
}
```

### File Management Endpoints

#### POST /api/files/upload
```csharp
// Request: IFormFile
// Response
public class FileUploadResponse
{
    public string FileId { get; set; }
    public string FileName { get; set; }
    public string FileUrl { get; set; }
    public long FileSize { get; set; }
    public string FileType { get; set; }
}
```

#### GET /api/files/{fileId}
```csharp
// Response: File stream
```

#### DELETE /api/files/{fileId}
```csharp
// No request body
```

### Analytics Endpoints

#### GET /api/forms/{formId}/analytics
```csharp
// Response
public class FormAnalyticsDto
{
    public int Views { get; set; }
    public int Submissions { get; set; }
    public decimal CompletionRate { get; set; }
    public int EmailsSent { get; set; }
    public int EmailsCompleted { get; set; }
    public double AverageCompletionTime { get; set; }
    public decimal DropoffRate { get; set; }
    public List<AnalyticsDataPoint> SubmissionsTrend { get; set; }
    public List<AnalyticsDataPoint> CompletionRateTrend { get; set; }
}
```

#### GET /api/analytics/dashboard
```csharp
// Response
public class DashboardAnalyticsDto
{
    public int TotalForms { get; set; }
    public int TotalSubmissions { get; set; }
    public int PendingReviews { get; set; }
    public decimal AverageCompletionRate { get; set; }
    public List<FormAnalyticsSummary> TopForms { get; set; }
    public List<AnalyticsDataPoint> SubmissionsTrend { get; set; }
}
```

### Reports Endpoints

#### GET /api/reports/quick/{reportType}
```csharp
// Path Parameters: reportType (executive-summary, risk-analysis, etc.)
// Query Parameters
public class QuickReportQuery
{
    public Guid? FormId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Format { get; set; } = "json"; // json, pdf, excel
}
```

#### POST /api/reports/custom
```csharp
// Request
public class CustomReportRequest
{
    public string Title { get; set; }
    public List<Guid> FormIds { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public List<string> Metrics { get; set; }
    public List<string> ChartTypes { get; set; }
    public string Format { get; set; } = "json";
}
```

#### GET /api/reports/{reportId}/download
```csharp
// Response: File stream (PDF/Excel)
```

### Categories Management Endpoints

#### GET /api/categories
```csharp
// Response: List<FormCategoryDto>
public class FormCategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Color { get; set; }
    public string Icon { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public bool IsActive { get; set; }
}
```

#### POST /api/categories
```csharp
// Request
public class CreateCategoryRequest
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Color { get; set; }
    public string Icon { get; set; }
    public Guid? ParentCategoryId { get; set; }
}
```

#### PUT /api/categories/{id}
```csharp
// Request: Same as CreateCategoryRequest
```

#### DELETE /api/categories/{id}
```csharp
// No request body
```

### System Settings Endpoints

#### GET /api/settings
```csharp
// Response: List<SystemSettingDto>
public class SystemSettingDto
{
    public string Key { get; set; }
    public string Value { get; set; }
    public string Description { get; set; }
    public string Type { get; set; }
}
```

#### PUT /api/settings/{key}
```csharp
// Request
public class UpdateSettingRequest
{
    public string Value { get; set; }
}
```

### Analytics Tracking Endpoints

#### POST /api/analytics/track
```csharp
// Request
public class TrackEventRequest
{
    public Guid FormId { get; set; }
    public string EventType { get; set; } // view, start, submit, abandon
    public Dictionary<string, object> EventData { get; set; }
    public string SessionId { get; set; }
}
```

#### GET /api/analytics/events/{formId}
```csharp
// Query Parameters
public class GetAnalyticsEventsQuery
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string EventType { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}
```

### Audit Log Endpoints

#### GET /api/audit-logs
```csharp
// Query Parameters
public class GetAuditLogsQuery
{
    public Guid? UserId { get; set; }
    public string EntityType { get; set; }
    public Guid? EntityId { get; set; }
    public string Action { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}

// Response
public class AuditLogDto
{
    public Guid Id { get; set; }
    public UserDto User { get; set; }
    public string EntityType { get; set; }
    public Guid EntityId { get; set; }
    public string Action { get; set; }
    public Dictionary<string, object> OldValues { get; set; }
    public Dictionary<string, object> NewValues { get; set; }
    public DateTime Timestamp { get; set; }
}
```

### Bulk Operations Endpoints

#### POST /api/submissions/bulk-update
```csharp
// Request
public class BulkUpdateSubmissionsRequest
{
    public List<Guid> SubmissionIds { get; set; }
    public string Status { get; set; }
    public string Comments { get; set; }
}
```

#### POST /api/submissions/bulk-export
```csharp
// Request
public class BulkExportRequest
{
    public List<Guid> SubmissionIds { get; set; }
    public string Format { get; set; } // csv, excel, pdf
    public bool IncludeAttachments { get; set; }
}
// Response: File stream
```

#### POST /api/forms/bulk-delete
```csharp
// Request
public class BulkDeleteFormsRequest
{
    public List<Guid> FormIds { get; set; }
}
```

### Form Validation Endpoints

#### POST /api/forms/{id}/validate
```csharp
// Request: FormDto (for validation)
// Response
public class FormValidationResponse
{
    public bool IsValid { get; set; }
    public List<ValidationError> Errors { get; set; }
    public List<ValidationWarning> Warnings { get; set; }
}

public class ValidationError
{
    public string FieldId { get; set; }
    public string Message { get; set; }
    public string Severity { get; set; }
}
```

### Public Form Endpoints (For Form Completion)

#### GET /api/public/forms/{token}
```csharp
// Public endpoint for recipients to access forms
// Response: FormDto with public-safe data
```

#### POST /api/public/forms/{token}/submit
```csharp
// Request
public class PublicSubmissionRequest
{
    public Dictionary<string, object> Responses { get; set; }
    public string SubmitterName { get; set; }
    public string SubmitterEmail { get; set; }
    public string CompanyName { get; set; }
}
```

#### GET /api/public/forms/{token}/progress
```csharp
// Get submission progress for a specific token
// Response
public class SubmissionProgressDto
{
    public decimal CompletionPercentage { get; set; }
    public DateTime LastUpdated { get; set; }
    public bool IsSubmitted { get; set; }
}
```

### Email Template Endpoints

#### GET /api/email-templates
```csharp
// Response: List<EmailTemplateDto>
public class EmailTemplateDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
    public string Type { get; set; } // invitation, reminder, notification
}
```

#### POST /api/email-templates
```csharp
// Request: CreateEmailTemplateRequest
```

#### PUT /api/email-templates/{id}
```csharp
// Request: UpdateEmailTemplateRequest
```

#### DELETE /api/email-templates/{id}
```csharp
// No request body
```

### Dashboard Summary Endpoints

#### GET /api/dashboard/summary
```csharp
// Response
public class DashboardSummaryDto
{
    public int TotalForms { get; set; }
    public int PublishedForms { get; set; }
    public int DraftForms { get; set; }
    public int TotalSubmissions { get; set; }
    public int PendingReviews { get; set; }
    public int ApprovedSubmissions { get; set; }
    public int RejectedSubmissions { get; set; }
    public decimal AverageCompletionRate { get; set; }
    public List<RecentActivityDto> RecentActivities { get; set; }
}
```

#### GET /api/dashboard/recent-activities
```csharp
// Response: List<RecentActivityDto>
public class RecentActivityDto
{
    public string Type { get; set; } // form_created, submission_received, etc.
    public string Description { get; set; }
    public DateTime Timestamp { get; set; }
    public UserDto User { get; set; }
    public string EntityType { get; set; }
    public Guid EntityId { get; set; }
}
```

### Form Theme and Styling Endpoints

#### GET /api/forms/{id}/theme
```csharp
// Response
public class FormThemeDto
{
    public string Theme { get; set; } // light, dark, custom
    public string CustomCss { get; set; }
    public string PrimaryColor { get; set; }
    public string SecondaryColor { get; set; }
    public string BackgroundColor { get; set; }
    public string FontFamily { get; set; }
}
```

#### PUT /api/forms/{id}/theme
```csharp
// Request: FormThemeDto
```

### Real-time Notifications Endpoints

#### GET /api/notifications
```csharp
// Response: List<NotificationDto>
public class NotificationDto
{
    public Guid Id { get; set; }
    public string Type { get; set; }
    public string Title { get; set; }
    public string Message { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public Dictionary<string, object> Data { get; set; }
}
```

#### PUT /api/notifications/{id}/mark-read
```csharp
// No request body
```

#### POST /api/notifications/mark-all-read
```csharp
// No request body
```

### Data Import/Export Endpoints

#### POST /api/forms/import
```csharp
// Request: IFormFile (CSV, JSON, XML)
// Response
public class ImportResultDto
{
    public int TotalProcessed { get; set; }
    public int SuccessCount { get; set; }
    public int ErrorCount { get; set; }
    public List<string> Errors { get; set; }
    public List<Guid> CreatedFormIds { get; set; }
}
```

#### GET /api/forms/export
```csharp
// Query Parameters
public class ExportFormsQuery
{
    public List<Guid> FormIds { get; set; }
    public string Format { get; set; } // json, csv, xml
    public bool IncludeSubmissions { get; set; }
}
// Response: File stream
```

### Integration Endpoints

#### GET /api/integrations/webhooks
```csharp
// Response: List<WebhookDto>
public class WebhookDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Url { get; set; }
    public List<string> Events { get; set; }
    public bool IsActive { get; set; }
    public string Secret { get; set; }
}
```

#### POST /api/integrations/webhooks
```csharp
// Request: CreateWebhookRequest
```

#### PUT /api/integrations/webhooks/{id}
```csharp
// Request: UpdateWebhookRequest
```

#### DELETE /api/integrations/webhooks/{id}
```csharp
// No request body
```

#### POST /api/integrations/webhooks/{id}/test
```csharp
// Request
public class TestWebhookRequest
{
    public string EventType { get; set; }
    public Dictionary<string, object> SampleData { get; set; }
}
```

## Data Transfer Objects (DTOs)

### FormDto
```csharp
public class FormDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int SubmissionCount { get; set; }
    public List<FormFieldDto> Fields { get; set; }
    public FormSettingsDto Settings { get; set; }
    public FormAnalyticsDto Analytics { get; set; }
    public UserDto CreatedBy { get; set; }
}
```

### FormFieldDto
```csharp
public class FormFieldDto
{
    public Guid Id { get; set; }
    public string Type { get; set; }
    public string Label { get; set; }
    public bool Required { get; set; }
    public int OrderIndex { get; set; }
    public object DefaultValue { get; set; }
    public string Placeholder { get; set; }
    public string Description { get; set; }
    public string ValidationRegex { get; set; }
    public string ErrorMessage { get; set; }
    public decimal? Weightage { get; set; }
    public List<string> Options { get; set; }
    public ScoringConfigDto ScoringConfig { get; set; }
    public ValidationRulesDto ValidationRules { get; set; }
}
```

### FormSettingsDto
```csharp
public class FormSettingsDto
{
    public bool AllowMultipleSubmissions { get; set; }
    public bool RequireLogin { get; set; }
    public bool ShowProgressBar { get; set; }
    public string Theme { get; set; }
    public string CustomCss { get; set; }
    public ScoringSettingsDto Scoring { get; set; }
    public ExpirationSettingsDto Expiration { get; set; }
    public EmailDistributionSettingsDto EmailDistribution { get; set; }
    public ApprovalSettingsDto Approval { get; set; }
    public DocumentSettingsDto Documents { get; set; }
}
```

### FormSubmissionDto
```csharp
public class FormSubmissionDto
{
    public Guid Id { get; set; }
    public Guid FormId { get; set; }
    public DateTime SubmittedAt { get; set; }
    public string Status { get; set; }
    public string SubmitterEmail { get; set; }
    public string SubmitterName { get; set; }
    public string CompanyName { get; set; }
    public string SubmissionType { get; set; }
    public decimal? CompletionPercentage { get; set; }
    public int? TimeSpent { get; set; }
    public Dictionary<string, object> Responses { get; set; }
    public SubmissionScoreDto Score { get; set; }
    public List<ReviewActivityDto> ActivityLog { get; set; }
    public List<DocumentAttachmentDto> Attachments { get; set; }
    public FormDto Form { get; set; }
}
```

## Implementation Notes

### Entity Framework Configuration
```csharp
// Program.cs
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// ApplicationDbContext.cs
public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Form> Forms { get; set; }
    public DbSet<FormField> FormFields { get; set; }
    public DbSet<FormSubmission> FormSubmissions { get; set; }
    // ... other DbSets

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure JSON columns
        modelBuilder.Entity<Form>()
            .Property(e => e.Settings)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<FormSettingsDto>(v, (JsonSerializerOptions)null));
        
        // Configure relationships
        modelBuilder.Entity<FormField>()
            .HasOne<Form>()
            .WithMany()
            .HasForeignKey(f => f.FormId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
```

### Authentication Configuration
```csharp
// Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
```

### File Storage Service
```csharp
public interface IFileStorageService
{
    Task<string> UploadFileAsync(IFormFile file, string containerName);
    Task<Stream> DownloadFileAsync(string fileUrl);
    Task DeleteFileAsync(string fileUrl);
}

// Azure Blob Storage Implementation
public class AzureBlobStorageService : IFileStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    
    public async Task<string> UploadFileAsync(IFormFile file, string containerName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
        var blobName = $"{Guid.NewGuid()}-{file.FileName}";
        var blobClient = containerClient.GetBlobClient(blobName);
        
        await blobClient.UploadAsync(file.OpenReadStream(), true);
        return blobClient.Uri.ToString();
    }
}
```

### Email Service
```csharp
public interface IEmailService
{
    Task SendFormInvitationAsync(EmailRecipient recipient, Form form, string invitationUrl);
    Task SendReminderAsync(EmailRecipient recipient, Form form, string formUrl);
    Task SendFormCompletionNotificationAsync(FormSubmission submission);
}
```

### Background Services
```csharp
// Reminder service to send email reminders
public class EmailReminderService : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await ProcessEmailReminders();
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }
}
```

## Security Considerations

1. **Authentication**: Use JWT tokens with proper expiration
2. **Authorization**: Implement role-based access control
3. **Input Validation**: Validate all inputs using Data Annotations and FluentValidation
4. **SQL Injection**: Use Entity Framework parameterized queries
5. **File Upload**: Validate file types and sizes, scan for malware
6. **CORS**: Configure proper CORS policies for frontend domains
7. **Rate Limiting**: Implement rate limiting for API endpoints
8. **HTTPS**: Enforce HTTPS in production

## Performance Optimizations

1. **Database Indexing**: Add indexes on frequently queried columns
2. **Caching**: Use Redis for caching frequently accessed data
3. **Pagination**: Implement proper pagination for large datasets
4. **Async Operations**: Use async/await throughout the application
5. **Connection Pooling**: Configure Entity Framework connection pooling
6. **Background Processing**: Use Hangfire for heavy operations like report generation

## Deployment Checklist

1. **Database Migration**: Set up Entity Framework migrations
2. **Environment Variables**: Configure connection strings and secrets
3. **Logging**: Set up structured logging with Serilog
4. **Health Checks**: Implement health check endpoints
5. **Monitoring**: Set up Application Insights or similar monitoring
6. **Load Balancing**: Configure load balancer if needed
7. **SSL Certificate**: Set up SSL certificate for HTTPS
8. **Backup Strategy**: Implement database backup strategy

This documentation provides a complete foundation for implementing the .NET backend for your Form Builder and Submission Management system.
