import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environment';

@Component({
  selector: 'app-profil-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profil-modal.component.html',
  styleUrl: './profil-modal.component.css'
})
export class ProfilModalComponent {
  @Input() user: any;
  @Output() edit = new EventEmitter<void>();

  apiUrl = environment.apiUrl;
  
  editProfile() {
    this.edit.emit();
  }

  ngOnChanges() {
    console.log("📌 Données reçues dans ProfilModalComponent :", this.user);
    if (this.user) {
      console.log("📌 Pseudo reçu :", this.user.pseudo);
    } else {
      console.warn("⚠️ Aucune donnée utilisateur reçue !");
    }
  }

  getPhotoUrl(photo: string): string {
    return photo.startsWith('/uploads/') ? `${this.apiUrl}${photo}` : `${this.apiUrl}/uploads/${photo}`;
  }

  
    
}
