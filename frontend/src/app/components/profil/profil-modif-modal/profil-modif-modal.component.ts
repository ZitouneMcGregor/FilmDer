import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { ProfilService } from '../../../services/profil/profil.service';
import { environment } from '../../../../../environment';

@Component({
  selector: 'app-profil-modif-modal',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './profil-modif-modal.component.html',
  styleUrl: './profil-modif-modal.component.css'
})
export class ProfilModifModalComponent implements OnInit {
  @Input() user: any;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  availablePhotos: string[] = [];
  apiUrl = environment.apiUrl;
  newPassword: string = ''; 
  confirmPassword: string = '';


  constructor(private profilService: ProfilService) {}

  ngOnInit() {
    this.profilService.getAvailablePhotos().subscribe(
      (photos) => {
        this.availablePhotos = photos;
        console.log("📸 Photos disponibles :", this.availablePhotos);
      },
      (error) => {
        console.error("⚠️ Erreur lors de la récupération des photos :", error);
      }
    );
  }

  selectPhoto(photo: string) {
    this.user.profile_picture = photo;
    console.log("📷 Photo sélectionnée :", this.user.profile_picture);
  }

  saveProfile() {
    if (this.user) {
      if (this.newPassword && this.newPassword !== this.confirmPassword) {
        console.error("Les mots de passe ne correspondent pas.");
        return;
      }
  
      const updatedUser: any = {
        pseudo: this.user.pseudo,
        profile_picture: this.user.profile_picture
      };8
      // N'ajouter le mot de passe que s'il a été modifié
      if (this.newPassword) {
        updatedUser.u_password = this.newPassword;
      }
      console.log("Données envoyées :", updatedUser);
      this.save.emit(updatedUser);
    }
  }
  
  cancelEdit() {
    console.log("Annulation de l'édition");
    this.cancel.emit();
  }
  
}