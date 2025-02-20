import {Component, inject, signal} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {matchControlsValidator} from '../../../validators/custom-validators';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {NgOptimizedImage} from '@angular/common';
import Swal from 'sweetalert2';
import {SUCCESS_MESSAGES as sm, ERROR_MESSAGES as em} from '../../../utils/app.constants';

@Component({
  selector: 'app-recover-account',
  imports: [
    MatProgressSpinner,
    MatError,
    MatButtonModule,
    MatFormField,
    MatIconModule,
    MatInputModule,
    MatLabel,
    NgOptimizedImage,
    ReactiveFormsModule,
    MatButtonModule, MatIconModule
  ],
  templateUrl: './recover-account.component.html',
  styleUrl: './recover-account.component.css'
})
export class RecoverAccountComponent {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  loading = false;
  showRecoveryForm = false;
  showChangePasswordForm = false;
  recoveryToken = '';
  validToken = false;

  recoverAccountForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]),
  })

  changePasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
    repeatPassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
  }, {validators: matchControlsValidator('password', 'repeatPassword')})

  ngOnInit(): void {
    this.loading = true;
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.verifyToken(token);
      } else {
        this.loading = false;
        this.showRecoveryForm = true;
      }
    });
  }

  submitRecoveryMail() {
    this.loading = true;
    this.authService.sendRecoveryEmail(this.recoverAccountForm.value.email!!).subscribe({
      next: result => {
        this.loading = false;
        Swal.fire(sm.SUCCESS_TAG, sm.RECOVERY_MAIL_SENDED, 'success').then((r) => {
          if (r.dismiss || r.isDismissed || r.isConfirmed) {
            this.redirectToLogin();
          }
        });
      },
      error: error => {
        this.loading = false;
        Swal.fire(em.ERROR_TAG, em.SERVER_ERROR, 'error').then((r) => {
          if (r.dismiss || r.isDismissed || r.isConfirmed) {
            this.redirectToLogin();
          }
        });
      }
    });
  }

  submitPasswordChange() {
    this.loading = true;
    this.authService.changePasswordWithToken(this.changePasswordForm.value.password!!, this.recoveryToken).subscribe({
      next: result => {
        this.loading = false;
        Swal.fire(sm.SUCCESS_TAG, sm.RECOVERY_PASSWORD_CHANGED, 'success').then((r) => {
          if (r.dismiss || r.isDismissed || r.isConfirmed) {
            this.redirectToLogin();
          }
        });
      },
      error: error => {
        this.loading = false;
        Swal.fire(em.ERROR_TAG, em.EXPIRED_TOKEN, 'error').then((r) => {
          if (r.dismiss || r.isDismissed || r.isConfirmed) {
            this.redirectToLogin();
          }
        });
      }
    })
  }

  verifyToken(token: string) {
    if (token.length === 200) {
      this.authService.verifyRecoveryToken(token).subscribe({
        next: response => {
          this.validToken = true;
          this.showChangePasswordForm = true;
          this.showRecoveryForm = false;
          this.loading = false;
          this.recoveryToken = token;
        },
        error: (error) => {
          this.validToken = false;
          this.showChangePasswordForm = false;
          this.showRecoveryForm = true;
          this.loading = false;
        }
      });
    } else {
      this.validToken = false;
      this.showRecoveryForm = true;
      this.loading = false;
    }
  }

  redirectToLogin() {
    this.authService.redirectToLogin();
  }

  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

}
