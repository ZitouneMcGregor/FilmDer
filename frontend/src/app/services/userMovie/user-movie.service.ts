import { Injectable } from '@angular/core';
import { environment } from '../../../../environment';  // Ajustez le chemin si besoin
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface UserMovie {
  id?: number;
  user_id: number;
  movie_id: number;
  movie_img: string;
  movie_rating: number;
  movie_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserMovieService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getUserMovies(userId: number): Observable<UserMovie[]> {
    return this.http.get<UserMovie[]>(`${this.apiUrl}/${userId}/movies`);
  }

  addUserMovie(userId: number, movie: UserMovie): Observable<UserMovie> {
    return this.http.post<UserMovie>(`${this.apiUrl}/${userId}/movies`, movie);
  }

  updateUserMovie(userId: number, movieId: number, movie: Partial<UserMovie>): Observable<UserMovie> {
    return this.http.put<UserMovie>(`${this.apiUrl}/${userId}/movies/${movieId}`, movie);
  }
  
  deleteUserMovie(userId: number, movieId: number): Observable<UserMovie> {
    return this.http.delete<UserMovie>(`${this.apiUrl}/${userId}/movies/${movieId}`);
  }  

}
