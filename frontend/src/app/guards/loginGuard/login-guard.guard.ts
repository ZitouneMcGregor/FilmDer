import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserServiceService } from '../../services/user/user-service.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {

  constructor(private userService: UserServiceService, private router: Router) {}

  canActivate(): boolean {
    if (this.userService.isLoggedIn()) {
        this.router.navigate(['/home']);
        return false;
    } else {
        return true;
    }
  }
}
