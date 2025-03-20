import { Component, Input } from '@angular/core';
import { UserMovie } from '../../../services/userMovie/user-movie-service.service';

@Component({
  selector: 'app-films-card',
  standalone: true,
  imports: [],
  templateUrl: './films-card.component.html',
  styleUrl: './films-card.component.css'
})
export class FilmsCardComponent {
  @Input() movie!: UserMovie;

}