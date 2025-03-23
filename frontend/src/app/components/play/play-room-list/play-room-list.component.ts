import { 
  Component, Input, SimpleChanges, OnInit, OnChanges, OnDestroy, NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserServiceService } from '../../../services/user/user-service.service';
import { RoomServiceService } from '../../../services/room/room-service.service';
import { RoomStoreService } from '../../../services/room/room-store.service';
import { UserId } from '../../../services/room/room-service.service';

@Component({
  selector: 'app-play-romm-list',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './play-room-list.component.html',
  styleUrls: ['./play-room-list.component.css']
})
export class PlayRommListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() userId: number = Number(localStorage.getItem('UserId'));  
  rooms: any[] = [];  
  error: string | null = null;

  private pollingIntervalId: any;

  constructor(
    private userService: UserServiceService,
    private roomService: RoomServiceService,
    private roomStore: RoomStoreService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    if (this.userId) {
      this.fetchRooms(); 
      this.roomStore.rooms$.subscribe((rooms) => {
        this.rooms = rooms;
      });
    }

    this.startPolling(5000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.fetchRooms();
    }
  }

  ngOnDestroy(): void {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
    }
  }

  startPolling(intervalMs: number): void {
    this.ngZone.runOutsideAngular(() => {
      this.pollingIntervalId = setInterval(() => {
        this.fetchRooms();
      }, intervalMs);
    });
  }

  fetchRooms(): void {
    this.error = null;
    this.userService.getRoomsByUserId(this.userId).subscribe({
      next: (data) => {
        this.roomStore.setRooms(data);

        data.forEach((room: any) => {
          this.roomService.getNbPlayers(room.id).subscribe({
            next: (playersData) => {
              room.currentPlayers = playersData.nb_players;  
              this.roomStore.updateRoom(room);
            },
            error: (err) => {
              console.error('Erreur lors de la récupération du nombre de joueurs:', err);
            }
          });
        });
      },
      error: (err) => {
        this.error = 'Erreur lors de la récupération des rooms.';
      }
    });
  }


  onStartRoom(room: any): void {
    if (room.id_admin !== this.userId) {
      console.warn('Vous n’êtes pas admin de cette partie');
      return;
    }
    const userId: UserId = { id: this.userId };
    this.roomService.startGame(room.id,userId ).subscribe({
      next: (response) => {
        console.log('La room a été lancée avec succès:', response);
        room.ready = 1;
        this.roomStore.updateRoom(room);
      },
      error: (err) => {
        console.error('Erreur lors du lancement de la room:', err);
      }
    });
  }
}
