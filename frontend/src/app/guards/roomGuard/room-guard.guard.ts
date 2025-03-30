import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MovieService } from '../../services/movie/movie.service';

@Injectable({
  providedIn: 'root'
})
export class RoomGuard implements CanActivate {

  constructor(private movieService: MovieService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
  ): Observable<boolean> {

    const roomId = Number(route.paramMap.get('id'));
    const userId = Number(localStorage.getItem("UserId"));

    if (!roomId) {

      this.router.navigate(['/play']);
      return of(false);
    }

    return this.movieService.getUserRoom(roomId, userId).pipe(
      map(userRoom => {
        return true;
      }),
      catchError(err => {
        this.router.navigate(['/play']);
        return of(false);
      })
    );
  }
}
