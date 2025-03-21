import { Component, Input } from '@angular/core';
import { UserMovie } from '../../../services/userMovie/user-movie-service.service';
import { TmdbServiceService } from '../../../services/tmdb/tmdb-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-films-card',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './films-card.component.html',
  styleUrl: './films-card.component.css'
})
export class FilmsCardComponent {
  @Input() movie!: UserMovie;
 
  movieDetails: any = null;
  modalOpen: boolean = false;

  constructor(private tmdbService: TmdbServiceService) {}

  showInfo(): void {
    this.tmdbService.getMovieDetails(this.movie.movie_id).subscribe({
      next: details => {
        this.movieDetails = details;
        this.modalOpen = true;
        console.log(this.movieDetails)
      },
      error: err => {
        console.error('Erreur lors de la récupération des détails', err);
      }
    });
  }

  closeModal(): void {
    this.modalOpen = false;
    this.movieDetails = null;
  }
}