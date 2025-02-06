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
  selector: 'app-customer-detail-dialog',
  imports: [
    DatePipe,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './customer-detail-dialog.component.html',
  styleUrl: './customer-detail-dialog.component.css'
})
export class CustomerDetailDialogComponent {
  constructor(public dialogRef: MatDialogRef<CustomerDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
