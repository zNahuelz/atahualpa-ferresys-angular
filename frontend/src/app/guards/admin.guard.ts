import {CanActivateFn} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  if (authService.isAuthenticated()) {
    return true
  } else {
    return authService.redirectToLogin();
  }
};
