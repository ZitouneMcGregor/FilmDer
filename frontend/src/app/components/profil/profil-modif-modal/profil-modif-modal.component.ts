import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { UserService } from '../../../services/user/user.service'; // Remplacer ProfilService
import { environment } from '../../../../../environment';
import { ProfilService } from '../../../services/profil/profil.service';

@Component({
  selector: 'app-profil-modif-modal',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './profil-modif-modal.component.html',
  styleUrls: ['./profil-modif-modal.component.css']
})
export class ProfilModifModalComponent implements OnInit {
  @Input() user: any; // Données utilisateur passées en entrée
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  availablePhotos: string[] = [];
  apiUrl = environment.apiUrl;
  newPassword: string = '';
  confirmPassword: string = '';
  profilePicture: string = '';

  constructor(private userService: UserService , private profilService: ProfilService) {}

  ngOnInit() {
    this.userService.getAvailablePhotos().subscribe({
      next: (photos) => {
        this.availablePhotos = photos;
        console.log('📸 Photos disponibles :', this.availablePhotos);
      },
      error: (error) => {
        console.error('⚠️ Erreur lors de la récupération des photos :', error);
      }
    });
  
  }


  getPhotoUrl(photo: string): string {
    // Si le chemin contient déjà /uploads/, ne pas le rajouter
    if (photo.startsWith('/uploads/')) {
      return `${this.apiUrl}${photo}`;
    }
    return `${this.apiUrl}/uploads/${photo}`;
  }

  selectPhoto(photo: string) {
    // Stocker uniquement le nom du fichier brut, comme attendu par le backend
    this.user.profile_picture = photo; // ex. "photo1.jpg"
    console.log('📷 Photo sélectionnée :', this.user.profile_picture);
  }

  saveProfile() {
    if (!this.user) {
      console.error('Aucun utilisateur à sauvegarder');
      return;
    }
  
    if (this.newPassword && this.newPassword !== this.confirmPassword) {
      console.error('Les mots de passe ne correspondent pas.');
      return;
    }
  
    const updatedUser: any = {
      pseudo: this.user.pseudo,
      profile_picture: this.user.profile_picture // Nom brut du fichier
    };
    if (this.newPassword) {
      updatedUser.u_password = this.newPassword;
    }
  
    console.log('Données envoyées :', updatedUser);
  
    this.profilService.updateUser(this.user.id, updatedUser).subscribe({
      next: (response) => {
        console.log('✅ Profil mis à jour avec succès', response);
        
        // 🔥 Mettre à jour le user dans UserServiceService
        this.userService.setUser(response); 
  
        this.save.emit(response);
      },
      error: (error) => {
        console.error('❌ Erreur lors de la mise à jour du profil', error);
      }
    });
  }
  

  cancelEdit() {
    console.log('Annulation de l’édition');
    this.cancel.emit();
  }
}