import { Injectable } from '@angular/core';
import { Room } from '../room/room-service.service';
import { environment } from '../../../../environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private isAuthenticated = false;
  private apiUrl = `${environment.apiUrl}/users`;
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<{ id: number }>(`${this.apiUrl}/check/?pseudo=${username}&u_password=${password}`)
      .pipe(
        map(response => {
          const isAuth = !!response.id;
          if (isAuth) {
            localStorage.setItem("UserId", String(response.id));
          }
          return isAuth;
        }),
        catchError(error => {
          console.error("Erreur d'authentification :", error);
          return of(false);
        })
      );
  }

  getUserId(): number | null {
    if (!this.isBrowser()) return null;
    const userId = localStorage.getItem("UserId");
    return userId ? parseInt(userId, 10) : null;
  }

  logout(): void {
    localStorage.removeItem("UserId");
    this.router.navigate(['/login']);
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
  
  
  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
      if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return false;
    }
    const userId = localStorage.getItem("UserId");
    return userId !== null && !isNaN(Number(userId));
  }
  
  getUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`).pipe(
      map(user => {
        this.userSubject.next(user); 
        return user;
      }),
      catchError(error => {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        return of(null);
      })
    );
  }
  
  updateUser(userId: number, updatedUser: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, updatedUser).pipe(
      map(response => {
        this.userSubject.next(response); 
      }),
      catchError(error => {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
        return of(null);
      })
    );
  }
  
  
  

  registerUser(user: { pseudo: string; u_password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }


  getRoomsByUserId(id: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/${id}/rooms`);
  }


}
