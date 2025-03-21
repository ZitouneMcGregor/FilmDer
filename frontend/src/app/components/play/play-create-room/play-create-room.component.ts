import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import {Room, RoomServiceService} from '../../../services/room/room-service.service';
@Component({
  selector: 'app-play-create-room',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './play-create-room.component.html',
  styleUrl: './play-create-room.component.css'
})
export class PlayCreateRoomComponent {
  nb_player!: number;
  nb_film!: number;
  name!: string;
  submitted = false;

  constructor(private roomService: RoomServiceService) {}

  onSubmit(): void {
    this.submitted = true; // Active la validation globale du formulaire

    if (!this.name || !this.nb_player || !this.nb_film) {
      console.error('Tous les champs doivent être remplis.');
      return;
    }

    const room: Room = {
      id_admin: 1,
      name: this.name,
      nb_player: this.nb_player,
      nb_film: this.nb_film
    };

    this.roomService.createRoom(room).subscribe({
      next: (response) => {
        console.log('Salle créée avec succès:', response);
        this.submitted = false; // Reset après succès
      },
      error: (error) => {
        console.error('Erreur lors de la création de la salle:', error);
      }
    });
  }
}

