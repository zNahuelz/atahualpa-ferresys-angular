import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-product-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, DatePipe],
  templateUrl: './product-detail-dialog.component.html',
  styleUrl: './product-detail-dialog.component.css'
})
export class ProductDetailDialogComponent {
  constructor(public dialogRef: MatDialogRef<ProductDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
