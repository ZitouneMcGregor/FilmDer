import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { RoomServiceService } from '../../services/room/room-service.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export const roomGuard: CanActivateFn = (route, state) => {
  
  return true;
}
