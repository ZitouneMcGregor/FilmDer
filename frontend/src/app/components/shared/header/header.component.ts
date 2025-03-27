// header.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../../../services/user/user-service.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isDark = false;
  user: any = null;
  apiUrl = environment.apiUrl;
  constructor(public userService: UserServiceService, private router: Router) {}

  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      this.loadUserProfile();
    }
  
    // Abonnez-vous à user$ pour obtenir les mises à jour des données de l'utilisateur
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }
  

  loadUserProfile() {
    const userId = this.userService.getUserId();
    if (userId) {
      this.userService.getUser(userId).subscribe(
        (data) => {
          this.user = data;
          console.log("📌 Données utilisateur dans la navbar :", this.user);
        },
        (error) => {
          console.error("⚠️ Erreur lors du chargement du profil :", error);
        }
      );
    }
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
