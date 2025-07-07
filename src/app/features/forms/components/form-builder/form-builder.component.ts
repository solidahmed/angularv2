import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormField, DocumentAttachment } from '@app/models/form.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@@ .. @@
  
  reorderFields(event: { dragIndex: number, hoverIndex: number }): void {
    if (this.isPublished) {
      this.handleReadOnlyAction();
      return;
    }
    
    if (event.dragIndex !== event.hoverIndex) {
      this.onReorderFields.emit(event);
    }
  }
  
  handleReadOnlyAction(): void {
}