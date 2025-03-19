import { CanActivateFn } from '@angular/router';

export const roomGuardGuard: CanActivateFn = (route, state) => {
  return true;
};
