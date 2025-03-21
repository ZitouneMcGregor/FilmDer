import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private isAuthenticated = false;
  private apiUrl = 'http://localhost:8000/users';
  

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
  
  

  registerUser(user: { pseudo: string; u_password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

}
