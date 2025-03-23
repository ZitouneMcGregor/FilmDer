import { Component } from '@angular/core';
import { PlayCreateRoomComponent } from "../play-create-room/play-create-room.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlayRommListComponent } from "../play-room-list/play-room-list.component";
import { RoomServiceService } from '../../../services/room/room-service.service';
import { RoomStoreService } from '../../../services/room/room-store.service';

@Component({
  selector: 'app-play-skeleton',
  standalone: true,
  imports: [ 
    PlayCreateRoomComponent,
    FormsModule,
    CommonModule,
    PlayRommListComponent 
  ],
  templateUrl: './play-skeleton.component.html',
  styleUrls: ['./play-skeleton.component.css'] // <-- petite correction: 'styleUrl' -> 'styleUrls'
})
export class PlaySkeletonComponent {
  join_code: string = '';
  creating_room: boolean = false;
  showModal = false; 
  roomCode: string = '';
  
  // Propriété pour stocker le message d'erreur
  errorMessage = '';

  constructor(
    private roomService: RoomServiceService,
    private roomStore: RoomStoreService
  ) {}

  onSubmit(): void {
    // Réinitialiser le message d'erreur à chaque tentative
    this.errorMessage = '';

    this.roomService.getRoomByJoinCode(this.join_code).subscribe({
      next: (room) => {
        this.roomService.joinRoom({
          user_id: Number(localStorage.getItem('UserId')), 
          room_id: room.id
        }).subscribe({
          next: (data) => {
            // Tout va bien : on ajoute la room au store
            this.roomStore.addRoom(room);
          },
          error: (err) => {
            // Room trouvée, mais l'erreur survient au moment de joinRoom
            if (err.status === 409) {
              // 409 peut signifier "Room is full" ou "UserRoom existe déjà"
              if (err.error?.detail === 'Room is full') {
                this.errorMessage = 'La salle est déjà pleine !';
              } else if (err.error?.detail === 'UserRoom existe') {
                this.errorMessage = 'Vous êtes déjà dans cette salle !';
              } else {
                this.errorMessage = 'Impossible de rejoindre la salle (erreur 409).';
              }
            } else {
              console.error('Erreur lors du Join Room:', err);
              this.errorMessage = 'Une erreur est survenue lors de la tentative de rejoindre la salle.';
            }
          },
        });
      },
      error: (err) => {
        // Ici c'est l'erreur 404 => "Room not found" etc.
        if (err.status === 404) {
          this.errorMessage = 'Code de connexion inconnu ou invalide !';
        } else {
          console.error('Erreur lors de la récupération de la room:', err);
          this.errorMessage = 'Une erreur est survenue lors de la récupération de la salle.';
        }
      }
    });
  }

  toggleCreateRoom(): void {
    this.creating_room = !this.creating_room;
  }

  onRoomCreated(code: string): void {
    this.toggleCreateRoom();
    this.roomCode = code;
    this.showModal = true; 
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.roomCode).then(() => {
      // Notification éventuelle
    });
  }

  closeModal(): void {
    this.showModal = false;
  }
}
