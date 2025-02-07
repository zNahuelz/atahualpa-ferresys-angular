import {Component, inject} from '@angular/core';
import {CustomerService} from '../../../../services/customer.service';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Customer} from '../../../../models/customer.model';
import {MatProgressSpinner, MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {integersOnly} from '../../../../utils/app.helpers';
import Swal from 'sweetalert2';
import {ERROR_MESSAGES as em, SUCCESS_MESSAGES as sm} from '../../../../utils/app.constants';

@Component({
  selector: 'app-edit-customer',
  imports: [
    MatProgressSpinner,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css'
})
export class EditCustomerComponent {
  private activatedRoute = inject(ActivatedRoute);
  private customerService = inject(CustomerService);
  protected readonly integersOnly = integersOnly;
  router = inject(Router);
  location = inject(Location);
  loading = false;

  customer = new Customer();
  customerId = this.activatedRoute.snapshot.paramMap.get('id');

  editCustomerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/), Validators.minLength(3), Validators.maxLength(30)]),
    surname: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/), Validators.minLength(3), Validators.maxLength(30)]),
    dni: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{8,9}$/), Validators.minLength(8), Validators.maxLength(8)]),
    address: new FormControl('', [Validators.maxLength(100), Validators.pattern(/^[^'"]*$/)]),
    phone: new FormControl('', [Validators.pattern(/^\+?\d{6,15}$/), Validators.minLength(6), Validators.maxLength(15)]),
    email: new FormControl('', [Validators.email, Validators.maxLength(50)]),
  });

  ngOnInit() {
    this.fetchCustomerById(parseInt(this.customerId!!));
  }

  onSubmit() {
    const customer = new Customer(
      this.editCustomerForm.value.name!!,
      this.editCustomerForm.value.surname!!,
      this.editCustomerForm.value.dni!!,
      this.editCustomerForm.value.address!!,
      this.editCustomerForm.value.phone!!,
      this.editCustomerForm.value.email!!,
    );

    this.customerService.updateCustomer(customer, parseInt(this.customerId!!)).subscribe({
      next: response => {
        Swal.fire(sm.SUCCESS_TAG, sm.CUSTOMER_UPDATED, 'success').then((r) => {
          if (r.dismiss || r.isDismissed || r.isConfirmed) {
            this.router.navigate(['/d/customer']);
          }
        });
      },
      error: err => {
        console.log(err);
        if (err.errors.dni) {
          Swal.fire(em.ERROR_TAG, em.DNI_TAKEN, 'error');
          this.editCustomerForm.patchValue({dni: this.customer.dni});
        } else {
          Swal.fire(em.ERROR_TAG, em.CUSTOMER_UPDATE_FAILED, 'error').then((r) => {
            if (r.dismiss || r.isDismissed || r.isConfirmed) {
              this.router.navigate(['/d/customer']);
            }
          });
        }
      }
    })
  }

  fetchCustomerById(id: number) {
    this.loading = true;
    this.customerService.getCustomerById(id).subscribe({
      next: response => {
        this.customer = response;
        this.editCustomerForm.patchValue({
          name: this.customer.name,
          surname: this.customer.surname,
          dni: this.customer.dni,
          address: this.customer.address,
          phone: this.customer.phone,
          email: this.customer.email,
        });
        this.loading = false;

      },
      error: error => {
        this.loading = true;
        this.router.navigate(['/d/customer']);
      }
    });
  }

  reloadPage() {
    window.location.reload();
  }
}
