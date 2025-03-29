// services/movie/movie.service.ts

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';

export interface Movie {
  id: number;
  room_id: number;
  movie_id: number;
  movie_index: number;
  nb_likes: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMoviesByRoom(roomId: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/rooms/${roomId}/movies`);
  }

  getUserRoom(roomId: number, userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/rooms/${roomId}/user/${userId}`);
  }

  voteMovie(
    roomId: number,
    userId: number,
    movieId: number,
    vote: number
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/rooms/${roomId}/vote`, {
      userId,
      movieId,
      vote
    });
  }
}