import {Component, inject} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {User} from '../../../models/user.model';
import Swal from 'sweetalert2';
import {ERROR_MESSAGES as em, SUCCESS_MESSAGES as sm} from '../../../utils/app.constants';
import {Router, RouterLink} from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {matchControlsValidator} from '../../../validators/custom-validators';

@Component({
  selector: 'app-profile',
  imports: [
    MatProgressSpinner, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, ReactiveFormsModule, RouterLink
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private authService = inject(AuthService);
  router = inject(Router)
  userData = new User();
  loading = false;

  profileForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
    newPasswordConfirm: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern(/^\+?\d{6,15}$/)]),
  }, {validators: matchControlsValidator('newPassword', 'newPasswordConfirm')});

  ngOnInit() {
    this.loading = true;
    this.authService.retrieveUserData().subscribe({
      next: response => {
        this.userData = response;
        this.profileForm.patchValue({
          username: this.userData.username!!,
          email: this.userData.email!!,
          phone: this.userData.phone!!,
        });
        this.profileForm.updateValueAndValidity();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        if (error.status === 401) {
          this.authService.logout();
        } else {
          Swal.fire(em.ERROR_TAG, em.SERVER_ERROR, 'error').then((r) => {
            if (r.isDismissed || r.isConfirmed || r.dismiss) {
              this.router.navigate(['/d']);
            }
          });
        }
      }
    });
  }

  onSubmit() {
    let formData = {
      id: this.userData.id,
      oldPassword: this.profileForm.value.oldPassword,
      newPassword: this.profileForm.value.newPassword,
      email: this.profileForm.value.email,
      phone: this.profileForm.value.phone,
      username: this.profileForm.value.username
    };
    this.loading = true;
    this.authService.updateAccountData(formData).subscribe({
      next: response => {
        this.loading = false;
        Swal.fire(sm.SUCCESS_TAG, `${sm.UPDATED_USER_DATA} Su nuevo nombre de usuario es: ${response.username}`, 'success').then((r) => {
          if (r.isDismissed || r.isConfirmed || r.dismiss) {
            this.authService.logout();
          }
        });
      },
      error: error => {
        this.loading = false;
        if (error.status == 400) {
          Swal.fire(em.ERROR_TAG, em.INCORRECT_CREDENTIALS, 'error').then((r) => {
            if (r.isDismissed || r.isConfirmed || r.dismiss) {
              window.location.reload();
            }
          });
        } else if (error.error.errors.id) {
          Swal.fire(em.ERROR_TAG, em.ACCOUNT_DELETED, 'error').then((r) => {
            if (r.isDismissed || r.isConfirmed || r.dismiss) {
              window.location.reload();
            }
          });
        } else if (error.error.errors.email) {
          Swal.fire(em.ERROR_TAG, em.EMAIL_TAKEN, 'error').then((r) => {
            if (r.isDismissed || r.isConfirmed || r.dismiss) {
              window.location.reload();
            }
          });
        } else if (error.error.errors.username) {
          Swal.fire(em.ERROR_TAG, em.USERNAME_TAKEN, 'error').then((r) => {
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
