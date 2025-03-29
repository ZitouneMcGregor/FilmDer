import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { RoomServiceService } from '../../services/room/room-service.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export const roomGuard: CanActivateFn = (route, state) => {
  const roomService = inject(RoomServiceService);
  const router = inject(Router);
  const userId = localStorage.getItem('UserId'); 
  const roomId = route.paramMap.get('id');

    // Vérifiez que userId et roomId ne sont pas null
    if (userId === null || roomId === null) {
      router.navigate(['/access-denied']);
      return of(false);
    }
  
    const userIdNumber = Number(userId);

    if (roomId) {
    return roomService.isUserInRoom(userIdNumber, roomId).pipe(
      switchMap(isUserInRoom => {
        if (isUserInRoom) {
          return of(true);
        } else {
          router.navigate(['/access-denied']);
          return of(false);
        }
      })
    );
  }
  return of(false);
};
