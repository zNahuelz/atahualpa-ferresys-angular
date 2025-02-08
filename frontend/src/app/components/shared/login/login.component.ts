import {NgOptimizedImage} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../../services/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatCheckboxModule, NgOptimizedImage],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
    rememberMe: new FormControl(false),
  });
  maintenance = false;

  clear() {
    this.loginForm.reset();
  }

  onSubmit() {
    this.authService.login(this.loginForm.value.username!!, this.loginForm.value.password!!, this.loginForm.value.rememberMe!!).subscribe((response) => {
        this.notificationService.showNotification('Bienvenido!!', 'alert');
        this.router.navigate(['/d']);
      },
      (err) => {
        Swal.fire('Oops! Credenciales Incorrectas','Usuario o contraseña incorrecta, intente nuevamente.','error').then((r) =>{
          if(r.dismiss || r.isDismissed || r.isConfirmed){
            window.location.reload();
          }
        });
      });
  }

  goToRecovery(){
    this.router.navigate(['/recover-account']);
  }
}
