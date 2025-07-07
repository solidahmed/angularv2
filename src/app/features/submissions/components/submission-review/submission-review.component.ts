@@ .. @@
 import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
 import { FormBuilder, FormGroup } from '@angular/forms';
import { FormSubmission, Form, ReviewActivity } from '../../../../models/form.model';
+import { FormSubmission, Form, ReviewActivity } from '@app/models/form.model';
 
 @Component({
   selector: 'app-submission-review',
 }
 )
@@ .. @@
   
   updateSubmission(submissionId: string, updates: Partial<FormSubmission>): void {
     if (this.onUpdateSubmission) {
-      this.onUpdateSubmission.emit({ submissionId, updates });
      this.onUpdateSubmission.emit({ submissionId, updates });
       
       // Update local state for immediate UI feedback
       this.submissions = this.submissions.map(sub =>
        sub.id === submissionId ? { ...sub, ...updates } : sub
      );
    }
  }