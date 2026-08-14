import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // If token exists, allow access
  if (token) {
    return true;
  }

  // If no token, kick them back to login
  router.navigate(['/login']);
  return false;
};
