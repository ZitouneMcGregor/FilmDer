import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilmsCardComponent } from '../films-card/films-card.component';
import { UserMovieService } from '../../../services/userMovie/user-movie.service';
import { UserMovie } from '../../../services/userMovie/user-movie.service';
import { TmdbService } from '../../../services/tmdb/tmdb.service';
 
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
  userId: number = Number(localStorage.getItem("UserId"));
  selectedMovie: any = null;
  newNote: number = 0;

  constructor(
    private tmdbService: TmdbService,
    private userMovieService: UserMovieService
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.userMovieService.getUserMovies(this.userId).subscribe({
      next: (data) => {
        this.movies = data.sort((a, b) => a.movie_name.localeCompare(b.movie_name));
      },
      error: (err) => {
        console.error('Erreur lors du chargement des films', err);
      }
    });
  }

  get filteredMovies(): UserMovie[] {
    if (!this.userSearchQuery.trim()) {
      return this.movies;
    }
    return this.movies.filter(movie =>
      movie.movie_name.toLowerCase().includes(this.userSearchQuery.toLowerCase())
    );
  }

  openAddMovieModal(): void {
    this.showAddMovieModal = true;
    this.searchQuery = '';
    this.searchResults = [];
    this.selectedMovie = null;
    this.newNote = 0;
  }

  closeAddMovieModal(): void {
    this.showAddMovieModal = false;
    this.searchQuery = '';
    this.searchResults = [];
    this.selectedMovie = null;
    this.newNote = 0;
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

  selectMovie(result: any): void {
    this.tmdbService.getMovieDetails(result.id).subscribe({
      next: details => {
        this.selectedMovie = details;
        this.newNote = 5;
      },
      error: err => {
        console.error('Erreur lors de la récupération des détails', err);
      }
    });
  }

  addMovieFromSelected(): void {
    if (!this.selectedMovie) return;
    
    const exists = this.movies.some(movie => movie.movie_id === this.selectedMovie.id);
    if (exists) {
      alert("Ce film est déjà dans votre liste !");
      return;
    }
    
    const newMovie: UserMovie = {
      user_id: this.userId,
      movie_id: this.selectedMovie.id,
      movie_img: this.selectedMovie.poster_path,
      movie_rating: this.newNote,
      movie_name: this.selectedMovie.title
    };
    this.userMovieService.addUserMovie(this.userId, newMovie).subscribe({
      next: (movieAdded) => {
        this.movies.push(movieAdded);
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