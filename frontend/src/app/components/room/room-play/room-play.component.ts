import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService, Movie } from '../../../services/movie/movie.service';
import { TmdbService } from '../../../services/tmdb/tmdb.service';
import { RoomService } from '../../../services/room/room.service';

@Component({
  selector: 'app-room-play',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './room-play.component.html',
  styleUrls: ['./room-play.component.css']
})
export class RoomPlayComponent implements OnInit {

  @Input() roomId!: number;
  userId = Number(localStorage.getItem("UserId"));

  movies: Movie[] = [];
  movieDetails: { [key: number]: any } = {};

  currentIndex = 0;

  isAnimating = false;
  animationType: 'like' | 'dislike' | '' = '';

  isRoomTerminated = false;

  constructor(
    private movieService: MovieService,
    private tmdbService: TmdbService,
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.roomId = Number(params.get('id'));
      this.loadRoomAndUserData();
    });
  }

  loadRoomAndUserData() {
    this.roomService.getRoom(this.roomId).subscribe({
      next: (room) => {
        if (room.close === 1) {
          this.redirectToResults();
          return;
        }
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

              this.fetchMovieDetailsForIndex(this.currentIndex + 1);

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

  redirectToResults() {
    this.router.navigate(['/result', this.roomId]);
  }


  terminateRoom() {
    this.isRoomTerminated = true;
    this.currentIndex = this.movies.length;
    this.redirectToResults();
  }

  handleEndOfList() {
    this.redirectToResults();
  }
}
