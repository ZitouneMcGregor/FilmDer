import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';

export interface Room{
id_admin: number;
name: string;
nb_player: number;
nb_film: number;
join_code?: string
id?: number;
close?: number;

}

export interface UserRoom{
  user_id: number;
  room_id?: number;
}

export interface UserRoomNumber{
  room_id: number;
  nb_players: number;
  nb_players_finished: number;
}

export interface UserId{
  id: number;
}



@Injectable({
  providedIn: 'root'
})



export class RoomService {

 private apiUrl = `${environment.apiUrl}/rooms`;

  constructor(private http: HttpClient) { }

  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}`, room);
    
  }

  joinRoom(userRoom: UserRoom): Observable<UserRoom> {
    return this.http.post<UserRoom>(`${this.apiUrl}/${userRoom.room_id}/users`, userRoom);
  }

  getNbPlayers(room_id: number): Observable<UserRoomNumber> {
    return this.http.get<UserRoomNumber>(`${this.apiUrl}/${room_id}/players`);
  }

  getRoomByJoinCode(join_code: string): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/join/${join_code}`);
  }

  startGame(room_id: number, user_id: UserId): Observable<any> {
    return this.http.put<UserId>(`${this.apiUrl}/${room_id}/start`, user_id);
  }


  stopGame(room_id: number, user_id: UserId): Observable<any> {
    return this.http.put<UserId>(`${this.apiUrl}/${room_id}/stop`, user_id);
  }


  deleteRoom(room_id: number, user_id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${room_id}/users/${user_id}`, {});
  }

  getRoom(room_id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${room_id}`);
  }


}


