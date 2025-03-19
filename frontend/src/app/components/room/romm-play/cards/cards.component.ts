import { Component } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent {
  movies = [
    { title: 'Olivier', description: 'Tous les soirs il fume la puff', image: 'z.png' },
    { title: 'Oussama Omar', description: 'What if Omar was rich, fat and a liar', image: 'oussamaamar.png' },
    { title: 'Omar', description: 'Omar Sifredi', image: 'omar.jpeg' },
  ];

  isAnimating = false;
  animationType: 'like' | 'dislike' | '' = '';

  removeMovie(type: 'like' | 'dislike') {
    if (this.movies.length > 0 && !this.isAnimating) {
      this.isAnimating = true;
      this.animationType = type;

      setTimeout(() => {
        this.movies.shift();
        this.isAnimating = false;
        this.animationType = '';
      }, 400); // Temps de l'animation
    }
  }
}
