import {Component, inject} from '@angular/core';
import {CustomerService} from '../../../../services/customer.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {allowIntegers, integersOnly} from '../../../../utils/app.helpers';
import {Location} from '@angular/common';
import {Customer} from '../../../../models/customer.model';
import Swal from 'sweetalert2';
import {ERROR_MESSAGES as em, SUCCESS_MESSAGES as sm} from '../../../../utils/app.constants';

@Component({
  selector: 'app-new-customer',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.css'
})
export class NewCustomerComponent {
  private customerService = inject(CustomerService);
  protected readonly allowIntegers = allowIntegers;
  protected readonly integersOnly = integersOnly;
  location = inject(Location);
  submitting = false;


  newCustomerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/), Validators.minLength(3), Validators.maxLength(30)]),
    surname: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/), Validators.minLength(3), Validators.maxLength(30)]),
    dni: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{8,9}$/), Validators.minLength(8), Validators.maxLength(8)]),
    address: new FormControl('', [Validators.maxLength(100), Validators.pattern(/^[^'"]*$/)]),
    phone: new FormControl('', [Validators.pattern(/^\+?\d{6,15}$/), Validators.minLength(6), Validators.maxLength(15)]),
    email: new FormControl('', [Validators.email, Validators.maxLength(50)]),
  });

  onSubmit() {
    this.submitting = true;
    const customer = new Customer(
      this.newCustomerForm.value.name!!,
      this.newCustomerForm.value.surname!!,
      this.newCustomerForm.value.dni!!,
      this.newCustomerForm.value.address!!,
      this.newCustomerForm.value.phone!!,
      this.newCustomerForm.value.email!!,
    );

    this.customerService.createCustomer(customer).subscribe({
      next: response => {
        Swal.fire(sm.SUCCESS_TAG, sm.CUSTOMER_CREATED, 'success').then((r) => {
          if (r.isConfirmed || r.isDismissed || r.dismiss) {
            window.location.reload();
          }
        });
        this.submitting = false;
      },
      error: error => {
        if (error.errors.dni) {
          Swal.fire(em.ERROR_TAG, em.DNI_TAKEN, 'error');
          this.newCustomerForm.patchValue({dni: ''});
          this.newCustomerForm.updateValueAndValidity();
          this.submitting = false;
        } else {
          Swal.fire(em.ERROR_TAG, em.SERVER_ERROR, 'error').then((r) => {
            if (r.dismiss || r.isDismissed || r.isConfirmed) {
              window.location.reload();
            }
          });
        }
      }
    });
  }

}
