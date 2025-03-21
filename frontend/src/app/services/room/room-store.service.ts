import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomStoreService {
  private roomsSubject = new BehaviorSubject<any[]>([]); 
  rooms$ = this.roomsSubject.asObservable(); 

  constructor() {}

  addRoom(room: any): void {
    const currentRooms = this.roomsSubject.value;
    this.roomsSubject.next([...currentRooms, room]);
  }

  joinRoom(room: any): void {
    const currentRooms = this.roomsSubject.value;
    const updatedRooms = currentRooms.map(r => r.id === room.id ? room : r); // Met à jour la room
    this.roomsSubject.next(updatedRooms);
  }

  setRooms(rooms: any[]): void {
    this.roomsSubject.next(rooms);
  }

  getRooms(): any[] {
    return this.roomsSubject.value;
  }
}
