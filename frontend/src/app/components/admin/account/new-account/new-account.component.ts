import {Component, inject} from '@angular/core';
import {AuthService} from '../../../../services/auth.service';
import {RoleService} from '../../../../services/role.service';
import {Role} from '../../../../models/role.model';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {notZeroValidator} from '../../../../validators/custom-validators';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {RouterLink} from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import {SUCCESS_MESSAGES as sm, ERROR_MESSAGES as em} from '../../../../utils/app.constants';

@Component({
  selector: 'app-new-account',
  imports: [
    FormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatOption,
    MatSelect,
    RouterLink,
    MatProgressSpinner
  ],
  templateUrl: './new-account.component.html',
  styleUrl: './new-account.component.css'
})
export class NewAccountComponent {
  private authService = inject(AuthService);
  private roleService = inject(RoleService);
  loading = false;
  loadError = false;
  submitting = false;
  roles: Role[] = [];

  createAccountForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/), Validators.minLength(3), Validators.maxLength(30)]),
    paternal_surname: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/), Validators.minLength(3), Validators.maxLength(30)]),
    maternal_surname: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/), Validators.minLength(3), Validators.maxLength(30)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\+?\d{6,15}$/), Validators.minLength(6), Validators.maxLength(15)]),
    role: new FormControl(1, [Validators.required, notZeroValidator()]),
  });

  ngOnInit(): void {
    this.fetchRoles();
  }

  fetchRoles(): void {
    this.loading = true;
    this.roleService.getRoles().subscribe({
      next: response => {
        this.roles = response;
        if (this.roles.length <= 0) {
          this.loadError = true;
          this.loading = false;
        } else {
          this.loading = false;
        }
      },
      error: error => {
        this.loadError = true;
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.submitting = true;
    this.authService.createAccount(this.createAccountForm.value).subscribe({
      next: response => {
        Swal.fire(sm.SUCCESS_TAG, sm.ACCOUNT_CREATED, 'success').then((r) => {
          if (r.isConfirmed || r.isDismissed || r.dismiss) {
            this.reloadPage();
          }
        });
      },
      error: error => {
        this.submitting = false;
        if (error.error.errors.email) {
          this.createAccountForm.patchValue({email: ''});
          this.createAccountForm.updateValueAndValidity();
          Swal.fire(em.ERROR_TAG, em.EMAIL_TAKEN, 'error');
        } else if (error.error.errors.role) {
          Swal.fire(em.ERROR_TAG, em.ROLE_NOT_FOUND, 'error').then((r) => {
            if (r.isDismissed || r.isConfirmed || r.dismiss) {
              window.location.reload();
            }
          });
        } else {
          Swal.fire(em.ERROR_TAG, em.SERVER_ERROR, 'error').then((r) => {
            if (r.isDismissed || r.isConfirmed || r.dismiss) {
              window.location.reload();
            }
          });
        }
      }
    });
  }

  reloadPage() {
    window.location.reload();
  }
}
