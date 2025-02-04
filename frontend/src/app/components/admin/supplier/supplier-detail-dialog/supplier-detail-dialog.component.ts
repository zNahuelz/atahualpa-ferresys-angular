import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-supplier-detail-dialog',
  imports: [
    DatePipe,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './supplier-detail-dialog.component.html',
  styleUrl: './supplier-detail-dialog.component.css'
})
export class SupplierDetailDialogComponent {
  constructor(public dialogRef: MatDialogRef<SupplierDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
