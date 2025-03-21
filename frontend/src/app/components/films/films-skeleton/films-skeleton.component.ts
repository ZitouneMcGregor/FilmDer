import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilmsCardComponent } from '../films-card/films-card.component';
import { UserMovieServiceService } from '../../../services/userMovie/user-movie-service.service';
import { UserMovie } from '../../../services/userMovie/user-movie-service.service';
import { TmdbServiceService } from '../../../services/tmdb/tmdb-service.service';

interface Film {
  image: string;
  name: string;
  note: number;
}
 
@Component({
  selector: 'app-films-skeleton',
  standalone: true,
  imports: [CommonModule, FormsModule, FilmsCardComponent],
  templateUrl: './films-skeleton.component.html',
  styleUrl: './films-skeleton.component.css'
})
export class FilmsSkeletonComponent {

  movies: UserMovie[] = [];
  userSearchQuery: string = '';
  searchQuery: string = '';
  searchResults: any[] = [];
  showAddMovieModal: boolean = false;
  userId: number = 1;

  constructor(
    private tmdbService: TmdbServiceService,
    private userMovieService: UserMovieServiceService
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.userMovieService.getUserMovies(this.userId).subscribe({
      next: (data) => {
        // Trie les films par ordre alphabétique sur le nom
        this.movies = data.sort((a, b) => a.movie_name.localeCompare(b.movie_name));
      },
      error: (err) => {
        console.error('Erreur lors du chargement des films', err);
      }
    });
  }

  // Filtre les films de l'utilisateur en fonction de la recherche
  get filteredMovies(): UserMovie[] {
    if (!this.userSearchQuery.trim()) {
      return this.movies;
    }
    return this.movies.filter(movie =>
      movie.movie_name.toLowerCase().includes(this.userSearchQuery.toLowerCase())
    );
  }

  // Ouvre le modal pour ajouter un film
  openAddMovieModal(): void {
    this.showAddMovieModal = true;
  }

  // Ferme le modal et réinitialise la recherche TMDB
  closeAddMovieModal(): void {
    this.showAddMovieModal = false;
    this.searchQuery = '';
    this.searchResults = [];
  }

  searchMovies(): void {
    if (this.searchQuery.trim().length > 0) {
      this.tmdbService.searchMovies(this.searchQuery).subscribe({
        next: (results) => {
          this.searchResults = results;
        },
        error: (err) => {
          console.error('Erreur lors de la recherche TMDB', err);
        }
      });
    } else {
      this.searchResults = [];
    }
  }

  addMovieFromSearch(result: any): void {
    const newMovie: UserMovie = {
      user_id: this.userId,
      movie_id: result.id,
      movie_img: result.poster_path,
      movie_rating: result.vote_average,
      movie_name: result.title
    };

    this.userMovieService.addUserMovie(this.userId, newMovie).subscribe({
      next: (movieAdded) => {
        this.movies.push(movieAdded);
        // Re-trier après ajout
        this.movies.sort((a, b) => a.movie_name.localeCompare(b.movie_name));
        this.closeAddMovieModal();
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du film', err);
      }
    });
  }

  onMovieDeleted(movieId: number): void {
    this.movies = this.movies.filter(movie => movie.id !== movieId);
  }

  onMovieUpdated(updatedMovie: UserMovie): void {
    const index = this.movies.findIndex(movie => movie.id === updatedMovie.id);
    if (index !== -1) {
      this.movies[index] = updatedMovie;
    }
  }
}