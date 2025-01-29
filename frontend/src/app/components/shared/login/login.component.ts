import {DatePipe, NgOptimizedImage} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {AuthService} from '../../../services/auth.service';
import {HttpClientModule} from '@angular/common/http';
import {Router} from '@angular/router';
import {NotificationService} from '../../../services/notification.service';

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
    console.log(this.loginForm.value);
    console.log("ALGO");
    this.authService.login(this.loginForm.value.username!!, this.loginForm.value.password!!, this.loginForm.value.rememberMe!!).subscribe((response) => {
        console.log("OK");
        console.log(this.authService.getToken());
        console.log(this.authService.decodeToken(this.authService.getToken()!!));

        this.router.navigate(['/d']);
        this.notificationService.showNotification('Bienvenido!!', 'alert');
      },
      (err) => {
        console.log("Error!");
      });
  }
}
