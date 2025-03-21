// header.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../../../services/user/user-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isDark = false;
  

  constructor(public userService: UserServiceService, private router: Router) {}

  toggleTheme(): void {
    this.isDark = !this.isDark;
    const root = document.documentElement;
    if (this.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  logout(): void {
    this.userService.logout();
  }

}
