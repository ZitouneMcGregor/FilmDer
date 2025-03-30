import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { RoomService, UserId } from '../../../services/room/room.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../services/movie/movie.service';
import { TmdbService } from '../../../services/tmdb/tmdb.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-room-result',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './room-result.component.html',
  styleUrls: ['./room-result.component.css']
})
export class RoomResultComponent implements OnInit, OnDestroy {
  roomId!: number;
  isRoomTerminated: boolean = false;
  isAdmin: boolean = false;
  userId: number = Number(localStorage.getItem('UserId'));
  private pollingIntervalId: any;
  nb_players!: number;
  nb_players_finished!: number;
  ranking: any[] = [];

  constructor(
    private roomService: RoomService,  
    private route: ActivatedRoute, 
    private ngZone: NgZone, 
    private movieService: MovieService,
    private tmdbService: TmdbService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.roomId = Number(params['id']); 
      this.fetchRoom();
      this.startPolling(5000);
    });
  }

  ngOnDestroy(): void {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
    }
  }

  fetchRoom() {
    // Récupération de la room pour vérifier son état et l'admin
    this.roomService.getRoom(this.roomId).subscribe({
      next: (room) => {
        this.isRoomTerminated = room.close === 1;
        this.isAdmin = this.userId === room.id_admin;
        if (this.isRoomTerminated) {
          clearInterval(this.pollingIntervalId);
          this.displayResult();
        }
      },
      error: (err) => console.error("Erreur lors de la récupération de la salle :", err)
    });

    // Récupération du nombre de joueurs
    this.roomService.getNbPlayers(this.roomId).subscribe({
      next: (response) => {
        this.nb_players = response.nb_players;
        this.nb_players_finished = response.nb_players_finished;
      },
      error: (err) => console.error("Erreur lors de la récupération du nombre de joueurs :", err)
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

  endRoom(): void {
    if (!this.isAdmin) {
      console.warn('Vous n’êtes pas admin de cette partie');
      return;
    }
    const userId: UserId = { id: this.userId };
    this.roomService.stopGame(this.roomId, userId).subscribe({
      next: (response) => {
        console.log("Salle terminée", response);
        this.isRoomTerminated = true;
        clearInterval(this.pollingIntervalId);
        this.displayResult();
      },
      error: (err) => console.error("Erreur lors de la terminaison de la salle :", err)
    });
  }

  displayResult(): void {
    // Récupère les films de la room et trie par nb_likes décroissant
    this.movieService.getMoviesByRoom(this.roomId).subscribe({
      next: (movies) => {
        movies.sort((a: any, b: any) => b.nb_likes - a.nb_likes);
        // Pour chaque film, on récupère les détails via l'API TMDB
        const observables = movies.map((movie: any) =>
          this.tmdbService.getMovieDetails(movie.movie_id).pipe(
            map((details: any) => ({ ...movie, details: details }))
          )
        );
        forkJoin(observables).subscribe({
          next: (results) => {
            this.ranking = results;
          },
          error: (err) => console.error("Erreur lors de la récupération des détails des films :", err)
        });
      },
      error: (err) => console.error("Erreur lors de la récupération des films de la room :", err)
    });
  }
}
