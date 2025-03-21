import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; // <-- Ajoute ceci !
export interface Movie {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})

export class MovieService {
  private apiUrl = "http://127.0.0.1:8000/room/movies"
  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl)
  }
}
