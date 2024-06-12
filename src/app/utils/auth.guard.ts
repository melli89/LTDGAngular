import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const _authService = inject(AuthService);
  const _router = inject(Router);

  let logged = _authService.isAuthenticatedUser();

  if (logged)
  {
    const allowedRoles = route.data['roles'] as string[];

    if (!allowedRoles || allowedRoles.length === 0 || allowedRoles.some(role => _authService.hasRole(role))) {
      return true;
    }

    return _router.createUrlTree(['/home']);
  } 
  else 
  {
    return _router.createUrlTree(['/home']);;
  }
}
