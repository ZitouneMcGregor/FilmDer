import { Component } from '@angular/core';
import { Movie } from '../../../services/movie/movie.service';
@Component({
  selector: 'app-romm-result',
  standalone: true,
  imports: [],
  templateUrl: './romm-result.component.html',
  styleUrl: './romm-result.component.css'
})
export class ResultatsComponent {
  podiumMovies: Movie[] = [];
  loading: boolean = true;

}