import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isDark = false;
  user: any = null;
  profilePicture: string | null = null;
  apiUrl = environment.apiUrl;

  constructor(public userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      this.user = user;
      console.log('User profile updated in header:', this.user);
      if (user && user.profile_picture) {
        this.profilePicture = user.profile_picture.startsWith('/uploads/')
          ? `${this.apiUrl}${user.profile_picture}`
          : `${this.apiUrl}/uploads/${user.profile_picture}`;
        console.log('Profile picture set to:', this.profilePicture);
      } else {
        this.profilePicture = null;
      }
    });
  }

  goToProfile(): void {
    this.router.navigate(['/profil']);
  }
  
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