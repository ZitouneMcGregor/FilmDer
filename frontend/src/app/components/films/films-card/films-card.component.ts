import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserMovie, UserMovieServiceService } from '../../../services/userMovie/user-movie-service.service';
import { TmdbServiceService } from '../../../services/tmdb/tmdb-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-films-card',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './films-card.component.html',
  styleUrls: ['./films-card.component.css']
})
export class FilmsCardComponent {
  @Input() movie!: UserMovie;
  @Input() userId!: number;
  @Output() movieDeleted = new EventEmitter<number>();
  @Output() movieUpdated = new EventEmitter<UserMovie>();

  movieDetails: any = null;
  modalOpen: boolean = false;

  // Pour la modification de la note
  editing: boolean = false;
  newNote: number = 0;

  constructor(
    private tmdbService: TmdbServiceService,
    private userMovieService: UserMovieServiceService
  ) {}

  // Ouvre le modal d'info en appelant TMDB
  showInfo(): void {
    this.tmdbService.getMovieDetails(this.movie.movie_id).subscribe({
      next: details => {
        this.movieDetails = details;
        this.modalOpen = true;
        console.log(this.movieDetails);
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

  // Gestion de l'édition de la note
  startEditing(): void {
    this.editing = true;
    this.newNote = this.movie.movie_rating;
  }

  cancelEditing(): void {
    this.editing = false;
    this.newNote = this.movie.movie_rating;
  }

  saveNote(): void {
    // Pour satisfaire le backend, on renvoie les autres infos déjà présentes
    const updateData = {
      movie_img: this.movie.movie_img,
      movie_name: this.movie.movie_name,
      movie_rating: this.newNote
    };
    this.userMovieService.updateUserMovie(this.movie.user_id, this.movie.id!, updateData)
      .subscribe({
        next: updatedMovie => {
          this.movie = updatedMovie;
          this.movieUpdated.emit(updatedMovie);
          this.editing = false;
        },
        error: err => {
          console.error('Erreur lors de la mise à jour de la note', err);
        }
      });
  }

  deleteMovie(): void {
    this.userMovieService.deleteUserMovie(this.movie.user_id, this.movie.id!)
      .subscribe({
        next: () => {
          this.movieDeleted.emit(this.movie.id!);
        },
        error: err => {
          console.error('Erreur lors de la suppression du film', err);
        }
      });
  }
}
