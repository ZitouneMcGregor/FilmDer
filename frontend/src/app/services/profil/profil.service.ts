import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';

interface User {
  id: number;
  pseudo: string;
  u_password?: string;
}

interface UserUpdate {
  pseudo: string;
  u_password: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  private apiUrl = `${environment.apiUrl}/users`; // Utilisation de l'environnement

  constructor(private http: HttpClient) {}

  getUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  updateUser(userId: number, updatedUser: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, updatedUser);
  }

  getAvailablePhotos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/photos`);
  }
}
