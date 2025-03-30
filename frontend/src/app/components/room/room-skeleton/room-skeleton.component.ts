import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomPlayComponent } from '../room-play/room-play.component';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-room-skeleton',
  standalone: true,
  imports: [RoomPlayComponent, NgIf],
  templateUrl: './room-skeleton.component.html',
  styleUrl: './room-skeleton.component.css'
})
export class RoomSkeletonComponent implements OnInit {
  roomId: number | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.roomId = id ? Number(id) : undefined;  // Convertir en number seulement si id existe
    console.log('Room ID:', this.roomId);
  }
}
