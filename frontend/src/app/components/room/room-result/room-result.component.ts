import { Component, Input, NgZone } from '@angular/core';
import { Room, RoomServiceService, UserId } from '../../../services/room/room-service.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../services/movie/movie.service';

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
    nb_players!: number;
    nb_players_finished!: number;
 



    constructor(private roomService: RoomServiceService,  private route: ActivatedRoute, private ngZone: NgZone, private movieService: MovieService) { }

    

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
            this.isRoomTerminated = room.close === 1;
            if(this.userId == room.id_admin){
              this.isAdmin = true;
              console.log("Vous êtes admin la salle");
            }else{
              this.isAdmin = false;
              console.log(this.userId, room.id_admin);
            }
        },
        error: (err) => console.error("Erreur lors de la récupération de la salle :", err)
    });

    this.roomService.getNbPlayers(this.roomId).subscribe({
      next: (response) => {
        this.nb_players = response.nb_players;
        this.nb_players_finished = response.nb_players_finished;
      },
      error: (err) => console.error("Erreur lors de la récupération du nombre de joueurs :", err)


    })};


    startPolling(intervalMs: number): void {
      this.ngZone.runOutsideAngular(() => {
        this.pollingIntervalId = setInterval(() => {
          this.ngZone.run(() => {
            this.fetchRoom();
          });
        }, intervalMs);
      });
      }

    
      endRoom(): void {
        if (this.isAdmin === false) {
              console.warn('Vous n’êtes pas admin de cette partie');
              return;
            }
            const userId: UserId = { id: this.userId };
        this.roomService.stopGame(this.roomId, userId).subscribe({
          next: (response) => {
            console.log("Salle terminée", response);
            this.isRoomTerminated = true;
            clearInterval(this.pollingIntervalId);
          },
          error: (err) => console.error("Erreur lors de la terminaison de la salle :", err)
        });
      }

      displayresult(): void {

        if (this.isRoomTerminated === false) {
          console.warn('La salle n’est pas encore terminée');
          return;
        }
        

      }
}
