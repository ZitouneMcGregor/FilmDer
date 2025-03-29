import { Room } from '../room/room-service.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = `${environment.apiUrl}/users`;
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    // Charge les données de l'utilisateur au démarrage si connecté
    if (this.isLoggedIn()) {
      const userId = this.getUserId();
      if (userId) {
        this.loadUser(userId); // Charge les données initiales
      }
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<{ id: number }>(`${this.apiUrl}/check/?pseudo=${username}&u_password=${password}`).pipe(
      map(response => {
        const isAuth = !!response.id;
        if (isAuth) {
          localStorage.setItem("UserId", String(response.id));
          this.loadUser(response.id); // Charge les données de l'utilisateur après connexion
        }
        return isAuth;
      }),
      catchError(error => {
        console.error("Erreur d'authentification :", error);
        return of(false);
      })
    );
  }

  setUser(user: any): void {
    this.userSubject.next(user);
  }
  

  logout(): void {
    localStorage.removeItem("UserId");
    this.userSubject.next(null); // Réinitialise les données utilisateur
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    const userId = localStorage.getItem("UserId");
    return userId !== null && !isNaN(Number(userId));
  }

  getUserId(): number | null {
    if (!this.isBrowser()) return null;
    const userId = localStorage.getItem("UserId");
    return userId ? parseInt(userId, 10) : null;
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  getUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`).pipe(
      map(user => {
        this.userSubject.next(user); // Met à jour le BehaviorSubject
        return user;
      }),
      catchError(error => {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        this.userSubject.next(null); // En cas d'erreur, réinitialise à null
        return of(null);
      })
    );
  }

  // Méthode privée pour charger les données utilisateur
  private loadUser(userId: number): void {
    this.getUser(userId).subscribe({
      next: (user) => {
        console.log('Utilisateur chargé dans le service :', user);
      },
      error: (error) => {
        console.error('Erreur lors du chargement initial :', error);
      }
    });
  }  

  
  updateUser(userId: number, updatedUser: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, updatedUser).pipe(
      map(response => {
        // Mettre à jour le BehaviorSubject avec la nouvelle réponse
        this.userSubject.next(response);
        return response;  // Retourner la réponse pour un éventuel usage ultérieur
      }),
      catchError(error => {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
        return of(null); // Retourner un observable avec valeur nulle en cas d'erreur
      })
    );
  }
    
  getAvailablePhotos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/photos`);
  }
  
  

  registerUser(user: { pseudo: string; u_password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }


  getRoomsByUserId(id: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/${id}/rooms`);
  }


}
