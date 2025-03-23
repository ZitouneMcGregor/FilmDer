import { Component, Output, EventEmitter } from '@angular/core';
import { RoomServiceService } from '../../../services/room/room-service.service';
import { Room } from '../../../services/room/room-service.service';  // Assurez-vous que cette importation est correcte
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoomStoreService } from '../../../services/room/room-store.service';

@Component({
  selector: 'app-play-create-room',
  standalone: true,
  imports: [ 
    FormsModule,
    CommonModule
    ],
  templateUrl: './play-create-room.component.html',
  styleUrl: './play-create-room.component.css'
})
export class PlayCreateRoomComponent {
  nb_player!: number;
  nb_film!: number;
  name!: string;
  submitted = false;

  @Output() roomCreated = new EventEmitter<string>();  // L'événement pour émettre le roomCode
  @Output() cancelCreate = new EventEmitter<any>();  // L'événement pour émettre le roomCode


  constructor(private roomService: RoomServiceService, private roomStore: RoomStoreService) {}

  onSubmit(): void {
    this.submitted = true; 

    if (!this.name || !this.nb_player || !this.nb_film) {
      console.error('Tous les champs doivent être remplis.');
      return;
    }

    const room: Room = {
      id_admin: Number(localStorage.getItem('UserId')),
      name: this.name,
      nb_player: this.nb_player,
      nb_film: this.nb_film
    };

    this.roomService.createRoom(room).subscribe({
      next: (response) => {
        console.log('Salle créée avec succès:', response);
        this.submitted = false; 
        this.roomCreated.emit(response.join_code);
        this.roomStore.addRoom(response);
        this.roomService.joinRoom({user_id: Number(localStorage.getItem('UserId')), room_id: response.id}).subscribe({
          next: (response) => {
            }
        });
      },
      error: (error) => {
        console.error('Erreur lors de la création de la salle:', error);
      }
    });

 
    
  }

  onCancel(): void {
    this.cancelCreate.emit();
  }

}
