@@ .. @@
 import { Component, Output, EventEmitter, OnInit } from '@angular/core';
-import { FormTemplate } from '@app/models/form.model';
+import { FormTemplate } from '@app/models/form.model';
 
 @Component({
   selector: 'app-form-library',
 }
 )
@@ .. @@
   
   useTemplate(template: FormTemplate): void {
     this.onUseTemplate.emit(template);
   }
-    this.snackBar.open(`Template "${template.name}" applied successfully`, 'Close', {
}
)
+    this.snackBar.open(`Template "${template.name}" applied successfully`, 'Close', {
       duration: 3000,
       horizontalPosition: 'center',
       verticalPosition: 'bottom'
}
)