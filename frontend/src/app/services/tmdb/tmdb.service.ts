import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private apiUrl = environment.tmdbApiUrl;
  private apiKey = environment.apiKey;

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
