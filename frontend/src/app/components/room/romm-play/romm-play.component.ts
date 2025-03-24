import { Component, inject, Input, OnInit } from '@angular/core';
import { NgFor, NgClass, CommonModule } from '@angular/common';
import { MovieService, Movie } from '../../../services/movie/movie.service';

@Component({
  selector: 'app-romm-play',
  standalone: true,
  imports: [NgFor, NgClass, CommonModule],
  templateUrl: './romm-play.component.html',
  styleUrl: './romm-play.component.css',
  providers: [MovieService] 
})
export class RommPlayComponent implements OnInit {
  userId = "123456"; // ID temporaire
  userVotes: { userId: string; movieId: number; vote: 1 | 0 }[] = [];
  isAnimating = false;
  animationType: 'like' | 'dislike' | '' = '';
  @Input() roomId!: number ;
  movies: Movie[] = [];
  private movieService = inject(MovieService);


  ngOnInit() {
    if (this.roomId) {
      console.log("Fetching movies for room:", this.roomId); 
      this.movieService.getMoviesByRoom(this.roomId).subscribe({
        next: (movies) => {
          this.movies = movies,
          console.log("Movies received from API:", movies); 
          },
        error: (err) => console.error("Erreur lors de la récupération des films :", err)
      });
    }
  }

  removeMovie(type: 'like' | 'dislike') {
    if (this.movies.length > 0 && !this.isAnimating) {
      this.isAnimating = true;
      this.animationType = type;

      setTimeout(() => {
        const movie = this.movies.shift();
        if (movie) {
          this.userVotes.push({ userId: this.userId, movieId: movie.movie_id, vote: type === 'like'? 1 : 0 });
        }

        this.isAnimating = false;
        this.animationType = '';

        if (this.movies.length === 0) {
          this.handleEndOfList();
        }
      }, 400);
    }
  }

  handleEndOfList() {
    alert("Plus de films à afficher !");
    this.sendVotes()
  }

  sendVotes() {
    if (this.userVotes.length > 0) {
      
     
  
      this.movieService.voteMovies(this.roomId, this.userVotes).subscribe({
        next: (response) => {
          console.log('Votes envoyés avec succès', response);
        },
        error: (error) => {
          console.error("Erreur lors de l'envoi des votes :", error);
        },
      });
    }
  }
}
