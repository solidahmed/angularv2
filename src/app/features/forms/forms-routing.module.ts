import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { FormLibraryComponent } from './form-library/form-library.component';
import { FormPreviewComponent } from './form-preview/form-preview.component';

const routes: Routes = [
  { path: '', component: FormBuilderComponent },
  { path: 'new', component: FormBuilderComponent },
  { path: ':id', component: FormBuilderComponent },
  { path: ':id/preview', component: FormPreviewComponent },
  { path: 'library', component: FormLibraryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }