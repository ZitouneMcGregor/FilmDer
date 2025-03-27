import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmdbServiceService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = '1c147b2f3115f93d646b7d3b6da73b89';
  private jetonZit = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYzE0N2IyZjMxMTVmOTNkNjQ2YjdkM2I2ZGE3M2I4OSIsIm5iZiI6MTc0MjQ2MjI4MS4yODcwMDAyLCJzdWIiOiI2N2RiZGQ0OWZlYzU4YWEzYzVlOWVlYzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.NH_SIV66JTLKcXRfZlwF_b7_eobMrvW44OfXdsO_xuU"
  private cléZit = "1c147b2f3115f93d646b7d3b6da73b89"
  
  constructor(private http: HttpClient) {}

  searchMovies(query: string): Observable<any[]> {
    const url = `${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`;
    return this.http.get<any>(url).pipe(
      map(response => response.results)
    );
  }

  getMovieDetails(movieId: number): Observable<any> {
    const url = `${this.apiUrl}/movie/${movieId}?api_key=${this.apiKey}`;
    return this.http.get<any>(url);
  }
}