import { Component, Input, SimpleChanges } from '@angular/core';
import { UserServiceService } from '../../../services/user/user-service.service';
import { CommonModule } from '@angular/common';
import { RoomServiceService } from '../../../services/room/room-service.service';
import { RoomStoreService } from '../../../services/room/room-store.service';

@Component({
  selector: 'app-play-romm-list',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './play-room-list.component.html',
  styleUrl: './play-room-list.component.css'
})
export class PlayRommListComponent {

  @Input() userId: number = 1;  
  rooms: any[] = [];  
  loading: boolean = false;
  error: string | null = null;

  constructor(private userService: UserServiceService, private roomService: RoomServiceService, private roomStore: RoomStoreService) {}

  ngOnInit() {
    if (this.userId) {
      this.fetchRooms();
      this.roomStore.rooms$.subscribe((rooms) => {
        this.rooms = rooms;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.fetchRooms();
    }
  }

  

  fetchRooms(): void {
    this.loading = true;
    this.error = null;

    this.userService.getRoomsByUserId(this.userId).subscribe({
      next: (data) => {
        this.roomStore.setRooms(data); 
        this.rooms.forEach(room => {
          this.roomService.getNbPlayers(room.id).subscribe({
            next: (playersData) => {
              room.currentPlayers = playersData.nb_players;  
              this.roomStore.joinRoom(room);  
            },
            error: (err) => {
              console.error('Erreur lors de la récupération du nombre de joueurs:', err);
            }
          });
        });
        this.loading = false;
        
      },
      error: (err) => {
        this.error = 'Erreur lors de la récupération des rooms.';
        this.loading = false;
      }
    });
  }

  

}
