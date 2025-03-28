import { Component, Input, NgZone } from '@angular/core';
import { Room, RoomServiceService } from '../../../services/room/room-service.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room-result',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './room-result.component.html',
  styleUrl: './room-result.component.css'
})
export class RoomResultComponent {
    roomId!: number;
    isRoomTerminated: boolean = false;
    isAdmin: boolean = false;
    userId: number = Number(localStorage.getItem('UserId'));
    private pollingIntervalId: any;
 



    constructor(private roomService: RoomServiceService,  private route: ActivatedRoute, private ngZone: NgZone,) { }

    ngOnInit() {

      this.route.params.subscribe(params => {
        this.roomId = Number(+params['id']); 
        this.fetchRoom();
        this.startPolling(5000);
      });

    }

    fetchRoom(){

      this.roomService.getRoom(this.roomId).subscribe({
        next: (room) => {
            const roomData = Array.isArray(room) ? room[0] : room;
            this.isRoomTerminated = roomData.close === 1;
            if(this.userId == room.id_admin){
              this.isAdmin = true;
            }
        },
        error: (err) => console.error("Erreur lors de la récupération de la salle :", err)
    });

    }


    startPolling(intervalMs: number): void {
      this.ngZone.runOutsideAngular(() => {
        this.pollingIntervalId = setInterval(() => {
          this.ngZone.run(() => {
            this.fetchRoom();
          });
        }, intervalMs);
      });
      }
  

}
