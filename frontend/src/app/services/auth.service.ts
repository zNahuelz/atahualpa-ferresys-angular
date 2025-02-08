import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service'
import {catchError, Observable, of, tap, throwError} from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import {Router} from '@angular/router';
import {NotificationService} from './notification.service';
import {HttpWrapperService} from './http-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:8000/api/auth'

  constructor() {
  }

  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  login(username: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, {username, password}).pipe(tap(response => {
        if (response.auth.token) {
          this.setToken(response.auth.token, rememberMe);
        }
      })
    );
  }

  private setToken(token: string, rememberMe: boolean): void {
    const expires = rememberMe ? 7 : undefined;
    this.cookieService.set('AUTH_TOKEN', token, {expires: expires, path: '/'});
  }

  getToken(): string | null {
    return this.cookieService.get('AUTH_TOKEN');
  }

  decodeToken(token: string): any {
    return jwtDecode(token);
  }

  isAuthenticated(): boolean {
    const token = this.cookieService.get('AUTH_TOKEN');
    if (token) {
      try {
        const decodedToken: any = this.decodeToken(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp > currentTime;
      } catch (e) {
        console.error('Error decoding token', e);
        return false;
      }
    }
    return false;
  }

  logout(): void {
    this.cookieService.delete('AUTH_TOKEN', '/');
    this.redirectToLogin();
  }

  redirectToLogin() {
    this.router.navigate(['']);
    return false;
  }

  getUserData() {
    const user = this.decodeToken(this.getToken()!);
    return {
      'username': user.username ?? 'USUARIO',
      'email': user.email ?? 'EMAIL@DOMINIO.COM',
    }
  }

  sendRecoveryEmail(email: string) {
    return this.http.post<any>(`${this.API_URL}/recover_account`, {email}).pipe(
      tap(response => {
        return true;
      }),
      catchError(error => {
        return of(false);
      })
    );
  }

  verifyRecoveryToken(token: string) {
    return this.http.post<any>(`${this.API_URL}/verify_token`, {token}).pipe(
      tap(response => {
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  changePasswordWithToken(password: string, token: string) {
    return this.http.post<any>(`${this.API_URL}/change_password`, {password, token}).pipe(
      tap(response => {
      }),
      catchError(error => {
        if (error.status === 404) {
          return throwError(() => new Error(error.message || 'Token expirado o invalido.'));
        } else {
          return throwError(() => new Error('Error al cambiar la contraseña. Intente nuevamente.'));
        }
      })
    );
  }
}
