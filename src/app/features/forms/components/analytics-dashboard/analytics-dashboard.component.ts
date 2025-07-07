@@ .. @@
 import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
-import { FormSubmission } from '@app/models/form.model';
+import { FormSubmission } from '../../../../models/form.model';
 
 @Component({
   selector: 'app-analytics-dashboard',
@@ .. @@
   filterSubmissions(filters: any): void {
     if (this.onFilterSubmissions) {
       this.onFilterSubmissions.emit(filters);
-  }
+    }
+  }
   
   private calculateApprovalRates(): void {
     const totalSubmissions = this.submissions.length;
@@ -12,5 +12,5 @@ import { FormSubmission } from '@app/models/form.model';
     this.approvalRate = totalSubmissions > 0 ? (approvedSubmissions / totalSubmissions) * 100 : 0;
     this.fullApprovalRate = approvedSubmissions > 0 ? (fullyApprovedSubmissions / approvedSubmissions) * 100 : 0;
     this.partialApprovalRate = approvedSubmissions > 0 ? (partiallyApprovedSubmissions / approvedSubmissions) * 100 : 0;
-  }
+  }
 }