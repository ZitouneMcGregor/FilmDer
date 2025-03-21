import { Injectable } from '@angular/core';
import { Room } from '../room/room-service.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getRoomsByUserId(id: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/${id}/rooms`);
  }


}