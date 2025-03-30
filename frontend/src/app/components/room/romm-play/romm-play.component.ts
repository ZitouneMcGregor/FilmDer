import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService, Movie } from '../../../services/movie/movie.service';
import { TmdbServiceService } from '../../../services/tmdb/tmdb-service.service';
import { RoomServiceService } from '../../../services/room/room-service.service';

@Component({
  selector: 'app-romm-play',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './romm-play.component.html',
  styleUrls: ['./romm-play.component.css']
})
export class RommPlayComponent implements OnInit {

  @Input() roomId!: number;
  userId = Number(localStorage.getItem("UserId"));

  movies: Movie[] = [];
  movieDetails: { [key: number]: any } = {};

  currentIndex = 0;

  isAnimating = false;
  animationType: 'like' | 'dislike' | '' = '';

  // Flag pour indiquer que la room est terminée (stoppée)
  isRoomTerminated = false;

  constructor(
    private movieService: MovieService,
    private tmdbService: TmdbServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomServiceService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.roomId = Number(params.get('id'));
      this.loadRoomAndUserData();
    });
  }

  /**
   * Vérifie d'abord l'état de la room via l'endpoint de Room.
   * Si la room est fermée (close == 1), redirige directement vers les résultats.
   * Sinon, récupère l'avancement de l'utilisateur (UserRoom.index_film) et charge les films.
   */
  loadRoomAndUserData() {
    this.roomService.getRoom(this.roomId).subscribe({
      next: (room) => {
        if (room.close === 1) {
          // La room est fermée : redirection immédiate
          this.redirectToResults();
          return;
        }
        // La room est ouverte, on récupère l'avancement de l'utilisateur
        this.movieService.getUserRoom(this.roomId, this.userId).subscribe({
          next: (userRoom) => {
            this.currentIndex = userRoom.index_film || 0;
            this.loadMovies();
          },
          error: (err) => {
            console.error("Erreur: l'utilisateur n'est pas dans la room", err);
          }
        });
      },
      error: (err) => {
        console.error("Erreur: room not found", err);
      }
    });
  }

  loadMovies() {
    this.movieService.getMoviesByRoom(this.roomId).subscribe({
      next: (movies) => {
        this.movies = movies;
        // On charge les détails du film courant et du suivant.
        this.fetchMovieDetailsForIndex(this.currentIndex);
        this.fetchMovieDetailsForIndex(this.currentIndex + 1);
      },
      error: (err) => {
        console.error("Erreur de chargement des films:", err);
      }
    });
  }

  fetchMovieDetailsForIndex(index: number) {
    if (index < this.movies.length) {
      const tmdbId = this.movies[index].movie_id;
      if (!this.movieDetails[tmdbId]) {
        this.tmdbService.getMovieDetails(tmdbId).subscribe({
          next: (details) => {
            this.movieDetails[tmdbId] = details;
          },
          error: (err) => {
            console.error(`Erreur TMDB pour le film ${tmdbId}:`, err);
          }
        });
      }
    }
  }

  get currentMovie(): Movie | null {
    if (this.currentIndex < this.movies.length) {
      return this.movies[this.currentIndex];
    }
    return null;
  }

  get nextMovie(): Movie | null {
    if (this.currentIndex + 1 < this.movies.length) {
      return this.movies[this.currentIndex + 1];
    }
    return null;
  }

  onLike() {
    this.vote('like');
  }

  onDislike() {
    this.vote('dislike');
  }

  vote(type: 'like' | 'dislike') {
    if (!this.currentMovie || this.isAnimating) return;

    this.isAnimating = true;
    this.animationType = type;

    setTimeout(() => {
      const movie = this.currentMovie;
      const voteValue = (type === 'like') ? 1 : 0;

      if (movie) {
        this.movieService.voteMovie(this.roomId, this.userId, movie.movie_id, voteValue)
          .subscribe({
            next: (response) => {
              console.log("Vote enregistré:", response);
              this.currentIndex++;

              // Charge les détails pour le prochain film si nécessaire.
              this.fetchMovieDetailsForIndex(this.currentIndex + 1);

              // Si on a swipé tous les films ou que la room est terminée, on redirige.
              if (this.currentIndex >= this.movies.length) {
                this.redirectToResults();
              }
            },
            error: (err) => {
              console.error("Erreur lors du vote:", err);
            },
            complete: () => {
              this.isAnimating = false;
              this.animationType = '';
            }
          });
      } else {
        console.error("Erreur: le film actuel est null.");
        this.isAnimating = false;
        this.animationType = '';
      }
    }, 400);
  }

  // Redirige l'utilisateur vers la page des résultats
  redirectToResults() {
    // On redirige vers /resultats/{roomId}
    this.router.navigate(['/result', this.roomId]);
  }

  // Méthode pouvant être appelée par un autre composant (ex. via un service ou événement)
  // lorsque l'admin arrête la room.
  terminateRoom() {
    this.isRoomTerminated = true;
    // On force l'index à un niveau maximum pour ne plus tenter de charger de cartes.
    this.currentIndex = this.movies.length;
    this.redirectToResults();
  }

  // Fonction de gestion si tous les films ont été swipés
  handleEndOfList() {
    // Plutôt qu'un alert, on redirige directement vers les résultats.
    this.redirectToResults();
  }
}
