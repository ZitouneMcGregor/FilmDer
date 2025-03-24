import { Component } from '@angular/core';
import { UserMovie } from '../../../services/userMovie/user-movie-service.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-romm-result',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './romm-result.component.html',
  styleUrl: './romm-result.component.css'
})
export class ResultatsComponent {
  podiumMovies: UserMovie[] = [
    {
      id: 1,
      user_id: 1,
      movie_id: 1,
      movie_img: "1",
      movie_rating: 1,
      movie_name : "1",
    },
    {
      id: 1,
      user_id: 1,
      movie_id: 1,
      movie_img: "1",
      movie_rating: 1,
      movie_name : "1",
    },{
      id: 1,
      user_id: 1,
      movie_id: 1,
      movie_img: "1",
      movie_rating: 1,
      movie_name : "1",
    }
  ];
  loading: boolean = false;

}