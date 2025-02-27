import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../services/auth.service';
import {User} from '../../../../models/user.model';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {RoleService} from '../../../../services/role.service';
import {Role} from '../../../../models/role.model';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {notZeroValidator} from '../../../../validators/custom-validators';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {SUCCESS_MESSAGES as sm, ERROR_MESSAGES as em} from '../../../../utils/app.constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-account',
  imports: [
    MatProgressSpinner,
    ReactiveFormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    RouterLink
  ],
  templateUrl: './edit-account.component.html',
  styleUrl: './edit-account.component.css'
})
export class EditAccountComponent {
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private roleService = inject(RoleService);
  private router = inject(Router);
  loading = false;
  submitting = false;
  loadError = false;
  user = new User();
  roles: Role[] = [];

  userId = this.activatedRoute.snapshot.paramMap.get('id');

  editAccountForm = new FormGroup({
    id: new FormControl(0),
    username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/), Validators.minLength(3), Validators.maxLength(30)]),
    paternal_surname: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/), Validators.minLength(3), Validators.maxLength(30)]),
    maternal_surname: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,30}$/), Validators.minLength(3), Validators.maxLength(30)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\+?\d{6,15}$/), Validators.minLength(6), Validators.maxLength(15)]),
    role: new FormControl(1, [Validators.required, notZeroValidator()]),
  });

  ngOnInit() {
    this.fetchUserById(parseInt(this.userId!!));
    this.fetchRoles();
  }

  onSubmit() {
    this.submitting = true;
    this.editAccountForm.patchValue({
      id: parseInt(this.userId!!)
    });
    this.authService.forceUpdateAccountData(this.editAccountForm.value, parseInt(this.userId!!)).subscribe({
      next: response => {
        this.submitting = false;
        Swal.fire(sm.SUCCESS_TAG, sm.ACCOUNT_UPDATED, 'success').then((r) => {
          if (r.isConfirmed || r.isDismissed || r.dismiss) {
            this.router.navigate(['/d/account']);
          }
        });
      },
      error: error => {
        this.submitting = false;
        if (error.error.errors.email) {
          this.editAccountForm.patchValue({email: ''});
          this.editAccountForm.updateValueAndValidity();
          Swal.fire(em.ERROR_TAG, em.EMAIL_TAKEN, 'error');
        } else if (error.error.errors.username) {
          this.editAccountForm.patchValue({username: ''});
          this.editAccountForm.updateValueAndValidity();
          Swal.fire(em.ERROR_TAG, em.USERNAME_TAKEN, 'error');
        } else {
          Swal.fire(em.ERROR_TAG, em.SERVER_ERROR, 'error').then((r) => {
            if (r.isConfirmed || r.isDismissed || r.dismiss) {
              window.location.reload();
            }
          });
        }
      }
    });
  }

  fetchUserById(id: number) {
    this.loading = true;
    this.authService.getUser(id).subscribe({
      next: response => {
        this.user = response;
        this.editAccountForm.patchValue({
          username: this.user.username,
          name: this.user.name,
          paternal_surname: this.user.paternal_surname,
          maternal_surname: this.user.maternal_surname,
          email: this.user.email,
          phone: this.user.phone,
          role: this.user.role!!.id || 2,
        });
        this.editAccountForm.updateValueAndValidity();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.router.navigate(['/d/account'])
      }
    });
  }

  fetchRoles() {
    this.loading = true;
    this.roleService.getRoles().subscribe({
      next: response => {
        this.roles = response;
        if (this.roles.length <= 0) {
          this.loading = false;
          this.loadError = true;
        } else {
          this.loading = false;
        }
      },
      error: error => {
        this.loading = false;
        this.loadError = true;
      }
    });
  }

  reloadPage() {
    window.location.reload();
  }
}
