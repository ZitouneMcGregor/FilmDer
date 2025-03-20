import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilmsCardComponent } from '../films-card/films-card.component';
import { UserMovieServiceService } from '../../../services/userMovie/user-movie-service.service';
import { UserMovie } from '../../../services/userMovie/user-movie-service.service';

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
  newMovieName: string = '';
  newMovieImg: string = '';
  newMovieRating: number = 0;
  
  // Pour l'exemple, on fixe l'ID de l'utilisateur à 1.
  userId: number = 1;

  constructor(private movieService: UserMovieServiceService) { }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.movieService.getUserMovies(this.userId).subscribe({
      next: data => this.movies = data,
      error: err => console.error('Erreur lors du chargement des films', err)
    });
  }

  addMovie(): void {
    // Pour cet exemple, on génère un identifiant temporaire pour movie_id (par exemple avec Date.now())
    const newMovie: UserMovie = {
      user_id: this.userId,
      movie_id: Date.now(),
      movie_img: this.newMovieImg || 'assets/images/default.jpg',
      movie_rating: this.newMovieRating,
      movie_name: this.newMovieName,
    };

    this.movieService.addUserMovie(this.userId, newMovie).subscribe({
      next: movie => {
        this.movies.push(movie);
        // Réinitialiser le formulaire
        this.newMovieName = '';
        this.newMovieImg = '';
        this.newMovieRating = 0;
      },
      error: err => console.error('Erreur lors de l\'ajout du film', err)
    });
  }
}