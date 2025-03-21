import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';


export interface Room{
id_admin: number;
name: string;
nb_player: number;
nb_film: number;
}


@Injectable({
  providedIn: 'root'
})



export class RoomServiceService {

 private apiUrl = `${environment.apiUrl}/rooms`;

  constructor(private http: HttpClient) { }

  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}`, room);
  }
  }


