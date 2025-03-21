import { Component } from '@angular/core';
import { PlayCreateRoomComponent } from "../play-create-room/play-create-room.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlayRommListComponent } from "../play-room-list/play-room-list.component";

@Component({
  selector: 'app-play-skeleton',
  standalone: true,
  imports: [ 
    PlayCreateRoomComponent,
    FormsModule,
    CommonModule,
    PlayRommListComponent 
  ],

  templateUrl: './play-skeleton.component.html',
  styleUrl: './play-skeleton.component.css'
})
export class PlaySkeletonComponent {
  join_code: string = '';
  creating_room: boolean = false;

  constructor() {}

  onSubmit(): void {
    console.log('Connexion avec le code:', this.join_code);
  }

  toggleCreateRoom() {
    this.creating_room = !this.creating_room;
  }

}
