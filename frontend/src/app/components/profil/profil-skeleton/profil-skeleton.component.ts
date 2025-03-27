import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilModalComponent } from '../profil-modal/profil-modal.component';
import { ProfilModifModalComponent } from '../profil-modif-modal/profil-modif-modal.component';
import { ProfilService } from '../../../services/profil/profil.service';
import { UserServiceService } from '../../../services/user/user-service.service';

@Component({
  selector: 'app-profil-skeleton',
  standalone: true,
  imports: [CommonModule, ProfilModalComponent, ProfilModifModalComponent],
  templateUrl: './profil-skeleton.component.html',
  styleUrls: ['./profil-skeleton.component.css'] 
})
export class ProfilSkeletonComponent implements OnInit {
  isViewingProfile = true;
  userId: number | null = null;
  user: any = {};

  constructor(private profilService: ProfilService, private userService: UserServiceService) {}

  ngOnInit() {
    const storedUserId = localStorage.getItem('UserId');
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
      this.userService.getUser(this.userId).subscribe(); 
    }

    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  loadUserProfile() {
    if (this.userId) {
      this.profilService.getUser(this.userId).subscribe(
        (data) => {
          console.log("📌 Données utilisateur récupérées :", data);
          this.user = data;
        },
        (error) => {
          console.error("⚠️ Erreur lors du chargement du profil :", error);
        }
      );
    }
  }

  toggleEdit() {
    console.log("🔄 Changement de mode :", this.isViewingProfile);
    this.isViewingProfile = !this.isViewingProfile;
  }
  
  onSave(updatedUser: any) {
    if (this.userId) {
      console.log("Data being sent to update:", updatedUser);
      this.profilService.updateUser(this.userId, updatedUser).subscribe({
        next: (response) => {
          console.log("✅ Mise à jour réussie :", response);
          this.user = response;
          this.toggleEdit();
        },
        error: (error) => {
          console.error("⚠️ Erreur lors de la mise à jour :", error);
        }
      });
    }
  }

  onCancel() {
    console.log("🔄 Annulation de la modification");
    this.toggleEdit();
  }
}
