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
  styleUrl: './play-skeleton.component.css'
})
export class PlaySkeletonComponent {
  join_code: string = '';
  creating_room: boolean = false;
  showModal = false; 
  roomCode: string = '';  
  constructor(private roomService: RoomServiceService,private roomStore: RoomStoreService) {}

  onSubmit(): void {
    
    this.roomService.getRoomByJoinCode(this.join_code).subscribe({
      next: (room) => {
       this.roomService.joinRoom({user_id: 1, room_id: room.id}).subscribe({
          next: (data) => {
            this.roomStore.addRoom(room);
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de la room:', err);
      }
    });

  }

  toggleCreateRoom(): void {
    this.creating_room = !this.creating_room;
  }

  onRoomCreated(code: string): void {
    this.toggleCreateRoom()
    this.roomCode = code;
    this.showModal = true; 
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.roomCode).then(() => {
    });
  }

  closeModal(): void {
    this.showModal = false;
  }



}
