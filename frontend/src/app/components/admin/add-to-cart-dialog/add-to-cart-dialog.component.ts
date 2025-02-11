import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {Product} from '../../../models/product.model';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-add-to-cart-dialog',
  imports: [MatDialogTitle, MatButton, MatDialogActions],
  templateUrl: './add-to-cart-dialog.component.html',
  styleUrl: './add-to-cart-dialog.component.css'
})
export class AddToCartDialogComponent {
  constructor(public dialogRef: MatDialogRef<AddToCartDialogComponent>, @Inject(MAT_DIALOG_DATA) public product: Product) {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
