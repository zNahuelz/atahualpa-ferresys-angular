import {ChangeDetectorRef, Component, inject, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {greaterThanZeroValidator} from '../../../validators/custom-validators';
import {allowIntegers, disableNegatives} from '../../../utils/app.helpers';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {CartHelper} from '../../../models/cart-helper.entity';

@Component({
  selector: 'app-add-to-cart-dialog',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, MatError, MatFormField, MatInput, MatLabel],
  templateUrl: './add-to-cart-dialog.component.html',
  styleUrl: './add-to-cart-dialog.component.css'
})
export class AddToCartDialogComponent {
  availableStock: number; // Dynamically calculated available stock


  addToCartForm: FormGroup = new FormGroup({ // Initialize with a default value
    amount: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\d+$'),
      Validators.min(1),
      Validators.max(0) // Default max value (will be updated later)
    ]),
  });

  constructor(
    public dialogRef: MatDialogRef<AddToCartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Step 1: Calculate the available stock dynamically
    const existingItem = this.data.cartItems.find((e: CartHelper) => e.product?.id === this.data.product.id);
    this.availableStock = this.data.product.stock - (existingItem ? existingItem.amount : 0);

    // Step 2: Check if the available stock is 0 or less
    if (this.availableStock <= 0) {
      this.closeDialog(); // Close the dialog immediately
      return; // Exit the constructor to prevent further initialization
    }

    // Step 3: Update the form with the correct max value
    this.addToCartForm.get('amount')?.setValidators([
      Validators.required,
      Validators.pattern('^\\d+$'),
      Validators.min(1),
      Validators.max(this.availableStock) // Use the calculated available stock for validation
    ]);
    this.addToCartForm.get('amount')?.updateValueAndValidity();
  }

  addToCart() {
    const amount = parseInt(this.addToCartForm.value.amount!!);
    const helper = new CartHelper(
      this.data.product,
      amount,
      this.data.product.sell_price!! * amount
    );

    // Pass the cart item back to the parent component
    this.dialogRef.close(helper);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  protected readonly disableNegatives = disableNegatives;
  protected readonly allowIntegers = allowIntegers;
}
