import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { RoomServiceService } from '../../services/room/room-service.service';

export const roomGuard: CanActivateFn = (route, state) => {
  const roomService = inject(RoomServiceService);
  const router = inject(Router);

  const roomId = route.paramMap.get('id');
  if (roomId) {
    // Vérifiez si l'utilisateur est dans la salle
    const isUserInRoom = roomService.isUserInRoom(roomId);
    if (isUserInRoom) {
      return true;
    } else {
      router.navigate(['/access-denied']);
      return false;
    }
  }
  return false;
};
