import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {allowIntegers} from '../../../../utils/app.helpers'
import {SupplierService} from '../../../../services/supplier.service';
import {Supplier} from '../../../../models/supplier.model';
import Swal from 'sweetalert2';
import {SUCCESS_MESSAGES as sm, ERROR_MESSAGES as em} from '../../../../utils/app.constants';
import {Location} from '@angular/common';

@Component({
  selector: 'app-new-supplier',
  imports: [ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule],
  templateUrl: './new-supplier.component.html',
  styleUrl: './new-supplier.component.css'
})
export class NewSupplierComponent {
  private supplierService = inject(SupplierService);
  allowIntegers = allowIntegers;
  location = inject(Location);

  newSupplierForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
    ruc: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^(10|20)\d{9}$/)]),
    address: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern(/^\+?\d{6,15}$/)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]),
    description: new FormControl('', [Validators.maxLength(150)]),
  });

  onSubmit() {
    const supplier = new Supplier(
      this.newSupplierForm.value.name!!,
      this.newSupplierForm.value.ruc!!.toString(),
      this.newSupplierForm.value.address!!,
      this.newSupplierForm.value.phone!!.toString(),
      this.newSupplierForm.value.email!!,
      this.newSupplierForm.value.description!!,
    );
    this.supplierService.createSupplier(supplier).subscribe({
      next: response => {
        Swal.fire(sm.SUCCESS_TAG, `${sm.SUPPLIER_CREATED} Información: ID ${response.supplier.id} NOMBRE: ${response.supplier.name}`, 'success')
          .then((r) => {
            if (r.isConfirmed || r.isDismissed || r.dismiss) {
              window.location.reload();
            }
          });
      },
      error: error => {
        if (error.errors.ruc) {
          Swal.fire(em.ERROR_TAG, em.RUC_TAKEN, 'error').then((r) => {
            this.newSupplierForm.get('ruc')!!.setValue('');
          });
        } else {
          Swal.fire(em.ERROR_TAG, em.SERVER_ERROR, 'error').then((r) => {
            if (r.isConfirmed || r.isDismissed || r.dismiss) {
              window.location.reload();
            }
          })
        }
      }
    })
  }

  resetForm() {
    this.newSupplierForm.reset();
  }

}
