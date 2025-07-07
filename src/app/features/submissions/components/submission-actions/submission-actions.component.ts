@@ .. @@
 import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
 import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormSubmission, Form, ReviewActivity } from '../../../../models/form.model';
+import { FormSubmission, Form, ReviewActivity } from '@app/models/form.model';
 
 @Component({
   selector: 'app-submission-actions',
 }
 )
@@ .. @@
   
   private addActivityLog(action: string, comments: string, metadata?: any): ReviewActivity[] {
     const newActivity: ReviewActivity = {
-      id: Date.now().toString(),
-      action: action as any,
      id: Date.now().toString(),
+      action: action as ReviewActivity['action'],
       comments,
       reviewedBy: 'Current User',
       reviewedAt: new Date(),
      metadata
    };
    
    return [...(this.submission.activityLog || []), newActivity];
  }