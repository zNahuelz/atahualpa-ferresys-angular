import {ActivatedRouteSnapshot, CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const generalGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  // Check if the user is authenticated
  if (!authService.isAuthenticated()) {
    return authService.redirectToLogin();
  }

  // Get the user's role
  const userRole = authService.getUserData().role;

  // Get the allowed roles for the target route (deepest matched route)
  let currentRoute: ActivatedRouteSnapshot | null = route;
  while (currentRoute?.firstChild) {
    currentRoute = currentRoute.firstChild;
  }

  const allowedRoles = currentRoute.data['roles'] as Array<string>;

  // If no roles are specified, allow access
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // Check if the user's role is allowed
  if (allowedRoles.includes(userRole)) {
    return true;
  } else {
    return authService.redirectToUnauthorized();
  }
};
