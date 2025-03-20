import { Component, inject } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { MovieService } from '../../../services/movie/movie.service';
import { Movie } from '../../../services/movie/movie.service';

@Component({
  selector: 'app-romm-play',
  standalone: true,
  imports: [NgFor, NgClass], // ✅ HttpClientModule inclus
  templateUrl: './romm-play.component.html',
  styleUrl: './romm-play.component.css',
  providers: [MovieService] // ✅ Fournit le service directement ici
})
export class RommPlayComponent {
  movies: Movie[] = [];
  isAnimating = false;
  animationType: 'like' | 'dislike' | '' = '';
  private movieService = inject(MovieService); // ✅ Utilisation de `inject()`, recommandé en Angular 18

  constructor() {
    this.fetchMovies();
  }

  fetchMovies() {
    this.movieService.getMovies().subscribe({
      next: (data) => this.movies = data,
      error: (err) => console.error('Erreur lors de la récupération des films', err)
    });
  }

  removeMovie(type: 'like' | 'dislike') {
    if (this.movies.length > 0 && !this.isAnimating) {
      this.isAnimating = true;
      this.animationType = type;

      setTimeout(() => {
        this.movies.shift();
        this.isAnimating = false;
        this.animationType = '';
      }, 400);
    }
  }
}
