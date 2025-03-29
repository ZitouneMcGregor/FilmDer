import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmdbServiceService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = '1c147b2f3115f93d646b7d3b6da73b89';

  constructor(private http: HttpClient) {}

  searchMovies(query: string): Observable<any[]> {
    const url = `${this.apiUrl}/search/movie?api_key=${this.apiKey}&language=fr-FR&query=${encodeURIComponent(query)}`;
    return this.http.get<any>(url).pipe(
      map(response => response.results)
    );
  }

  getMovieDetails(movieId: number): Observable<any> {
    const url = `${this.apiUrl}/movie/${movieId}?api_key=${this.apiKey}&language=fr-FR`;
    return this.http.get<any>(url);
  }
}
