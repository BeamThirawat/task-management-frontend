import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.checkCurrentUser().pipe(
    map((res) => {
      if (res.message?.toLowerCase() === 'success') {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError((err) => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
