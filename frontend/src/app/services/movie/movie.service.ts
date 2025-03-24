import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; // <-- Ajoute ceci !
import { environment } from '../../../../environment';


export interface Movie {
  id: number;
  name: string;
  movie_id: number;
  posterPath?: string;
  nb_likes: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = environment.apiUrl;
  private tmdbImagePath = "https://image.tmdb.org/t/p/w600_and_h900_bestv2/"; 

  // Clé et jeton pour l'authentification
  private apiKey = "1c147b2f3115f93d646b7d3b6da73b89";
  private apiToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYzE0N2IyZjMxMTVmOTNkNjQ2YjdkM2I2ZGE3M2I4OSIsIm5iZiI6MTc0MjQ2MjI4MS4yODcwMDAyLCJzdWIiOiI2N2RiZGQ0OWZlYzU4YWEzYzVlOWVlYzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.NH_SIV66JTLKcXRfZlwF_b7_eobMrvW44OfXdsO_xuU";
  private tmdbBaseUrl = 'https://api.themoviedb.org/3/movie/'
  constructor(private http: HttpClient) {}

  getMoviesByRoom(roomId: number): Observable<Movie[]> {
    console.log(`${this.apiUrl}/room/${roomId}/movies`);
    
    return this.http.get<Movie[]>(`${this.apiUrl}/rooms/${roomId}/movies`);
  }

  getMovieDetails(movieId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.apiToken}`,
    });

    return this.http.get<any>(`${this.tmdbBaseUrl}${movieId}`, { headers });
  }
}