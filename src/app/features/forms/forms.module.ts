import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Shared Module
import { SharedModule } from '../../shared/shared.module';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';

// Components
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { FormCanvasComponent } from './form-canvas/form-canvas.component';
import { FieldPaletteComponent } from './field-palette/field-palette.component';
import { FieldEditorComponent } from './field-editor/field-editor.component';
import { FormPreviewComponent } from './form-preview/form-preview.component';
import { FormLibraryComponent } from './form-library/form-library.component';
import { SettingsPanelComponent } from './settings-panel/settings-panel.component';
import { FormCategoryManagerComponent } from './form-category-manager/form-category-manager.component';
import { FileAttachmentManagerComponent } from './file-attachment-manager/file-attachment-manager.component';
import { FormInvitationsComponent } from './form-invitations/form-invitations.component';
import { FormSharingOptionsComponent } from './form-sharing-options/form-sharing-options.component';
import { EmailDistributionSettingsComponent } from './email-distribution-settings/email-distribution-settings.component';
import { EmailTemplateCustomizationComponent } from './email-template-customization/email-template-customization.component';
import { RecipientManagementComponent } from './recipient-management/recipient-management.component';
import { FormInvitationStatisticsComponent } from './form-invitation-statistics/form-invitation-statistics.component';
import { WeightageAndScoringSettingsComponent } from './weightage-and-scoring-settings/weightage-and-scoring-settings.component';
import { WeightageEditorComponent } from './weightage-editor/weightage-editor.component';
import { MultiSelectFilterComponent } from './components/multi-select-filter/multi-select-filter.component';
import { FormsRoutingModule } from './forms-routing.module';
import { FormsRoutingModule } from './forms-routing.module';

@NgModule({
  declarations: [
    FormBuilderComponent,
    FormCanvasComponent,
    FieldPaletteComponent,
    FieldEditorComponent,
    FormPreviewComponent,
    FormLibraryComponent,
    MultiSelectFilterComponent,
    SettingsPanelComponent,
    MultiSelectFilterComponent,
    FormCategoryManagerComponent,
    FileAttachmentManagerComponent,
    FormInvitationsComponent,
    FormSharingOptionsComponent,
    EmailDistributionSettingsComponent,
    EmailTemplateCustomizationComponent,
    RecipientManagementComponent,
    FormInvitationStatisticsComponent,
    WeightageAndScoringSettingsComponent,
  ],
  imports: [
    CommonModule,
    AngularFormsModule,
    ReactiveFormsModule,
    RouterModule,
    FormsRoutingModule,
    SharedModule,
    DragDropModule,
    
    // Material Modules
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatBadgeModule,
    MatChipsModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MultiSelectFilterComponent
  ],
  exports: [
    FormBuilderComponent,
    FormPreviewComponent,
    FormLibraryComponent,
    MultiSelectFilterComponent
  ]
})
export class FormsModule { }