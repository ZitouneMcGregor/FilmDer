import { Component, inject } from '@angular/core';
import { NgFor, NgClass, CommonModule} from '@angular/common';
import { MovieService } from '../../../services/movie/movie.service';
import { Movie } from '../../../services/movie/movie.service';

@Component({
  selector: 'app-romm-play',
  standalone: true,
  imports: [NgFor, NgClass, CommonModule],
  templateUrl: './romm-play.component.html',
  styleUrl: './romm-play.component.css',
  providers: [MovieService] 
})


export class RommPlayComponent {
  userId = "123456"; // ID générique temporaire


  // List tmp des films en attendant de les recup depuis le back
  movies =  [
    {"id": 1, "name": "Inception"},
    {"id": 2, "name": "Interstellar"},
    {"id": 3, "name": "The Matrix"},
    {"id": 4, "name": "The Dark Knight"},
    {"id": 5, "name": "Pulp Fiction"},
]

  // List des films likes/dislikes
  userVotes: { userId: string; movieId: number; vote: 'like' | 'dislike' }[] = [];

  isAnimating = false;
  animationType: 'like' | 'dislike' | '' = '';

  removeMovie(type: 'like' | 'dislike') {
    if (this.movies.length > 0 && !this.isAnimating) {
      this.isAnimating = true;
      this.animationType = type;

      setTimeout(() => {
        const movie = this.movies.shift();
        if (movie) {
          this.userVotes.push({ userId: this.userId, movieId: movie.id, vote: type });
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
    // Renvoyer vers le back la liste des films likés pour choisir ensuite
    // A Faire
    alert("Plus de films à afficher !");
  }
}
