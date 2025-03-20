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
  // Pour l'exemple, on fixe l'ID de l'utilisateur à 1.
  userId: number = 1;
  movies: UserMovie[] = [];
  
  // Variables pour la recherche sur TMDB
  searchQuery: string = '';
  searchResults: any[] = [];

  constructor(
    private movieService: UserMovieServiceService,
    private tmdbService: TmdbServiceService
  ) { }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.movieService.getUserMovies(this.userId).subscribe({
      next: data => this.movies = data,
      error: err => console.error('Erreur lors du chargement des films', err)
    });
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
    // Crée un objet UserMovie à partir des données de TMDB
    const newMovie: UserMovie = {
      user_id: this.userId,
      movie_id: result.id,
      movie_img: result.poster_path,
      movie_rating: result.vote_average, // Vous pouvez ajuster ou demander une note à l'utilisateur
      movie_name: result.title
    };

    // Appel à l'API pour ajouter le film en base
    this.movieService.addUserMovie(this.userId, newMovie).subscribe({
      next: (movieAdded) => {
        // Ajoute le film à la liste affichée
        this.movies.push(movieAdded);
        // Réinitialise la recherche
        this.searchQuery = '';
        this.searchResults = [];
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du film', err);
      }
    });
  }
}