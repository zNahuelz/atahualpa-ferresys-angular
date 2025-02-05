import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SupplierService} from '../../../../services/supplier.service';
import {Supplier} from '../../../../models/supplier.model';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {Location} from '@angular/common';
import {allowIntegers} from '../../../../utils/app.helpers';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import Swal from 'sweetalert2';
import {ERROR_MESSAGES as em, SUCCESS_MESSAGES as sm} from '../../../../utils/app.constants';

@Component({
  selector: 'app-edit-supplier',
  imports: [
    MatProgressSpinner,
    MatError,
    MatFabButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatSlideToggle
  ],
  templateUrl: './edit-supplier.component.html',
  styleUrl: './edit-supplier.component.css'
})
export class EditSupplierComponent {
  private activatedRoute = inject(ActivatedRoute);
  private supplierService = inject(SupplierService);
  private router = inject(Router);
  allowIntegers = allowIntegers;
  location = inject(Location);
  supplier = new Supplier();
  loading = true;
  submitting = false;

  supplierId = this.activatedRoute.snapshot.paramMap.get('id');

  editSupplierForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
    ruc: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^(10|20)\d{9}$/)]),
    address: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern(/^\+?\d{6,15}$/)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]),
    description: new FormControl('', [Validators.maxLength(150)]),
    visible: new FormControl(true, [Validators.required]),
  });

  ngOnInit() {
    this.fetchSupplierById(parseInt(this.supplierId!!));
  }

  onSubmit() {
    this.submitting = true;
    const supplier = new Supplier(
      this.editSupplierForm.value.name!!,
      this.editSupplierForm.value.ruc!!.toString(),
      this.editSupplierForm.value.address!!,
      this.editSupplierForm.value.phone!!.toString(),
      this.editSupplierForm.value.email!!,
      this.editSupplierForm.value.description!!,
      this.editSupplierForm.value.visible!!,
    );
    this.supplierService.updateSupplier(supplier, parseInt(this.supplierId!!)).subscribe({
      next: response => {
        this.submitting = false;
        Swal.fire(sm.SUCCESS_TAG, sm.SUPPLIER_UPDATED, 'success').then((r) => {
          if (r.isConfirmed || r.dismiss || r.isDismissed) {
            this.router.navigate(['/d/supplier'])
          }
        });
      },
      error: error => {
        console.log(error);
        if (error.errors.ruc) {
          Swal.fire(em.ERROR_TAG, em.RUC_TAKEN, 'error').then((r) => {
            this.editSupplierForm.get('ruc')!!.reset();
          });
        } else {
          Swal.fire(em.ERROR_TAG, em.SUPPLIER_UPDATE_FAILED, 'error').then((r) => {
            if (r.isConfirmed || r.dismiss || r.isDismissed) {
              this.router.navigate(['/d/supplier'])
            }
          })
        }
      }
    });
  }

  fetchSupplierById(id: number) {
    this.supplierService.getSupplierById(id).subscribe({
      next: result => {
        this.supplier = result;
        this.loading = false;
        this.editSupplierForm.patchValue({
          name: this.supplier.name,
          ruc: this.supplier.ruc!!.toString(),
          address: this.supplier.address,
          phone: this.supplier.phone!!.toString(),
          email: this.supplier.email,
          description: this.supplier.description,
          visible: this.supplier.visible,
        });
      },
      error: error => {
        this.loading = false;
        this.router.navigate(['/d/supplier'])
      }
    });
  }

  resetForm() {
    window.location.reload();
  }
}
