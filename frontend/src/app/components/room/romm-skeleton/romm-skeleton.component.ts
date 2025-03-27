import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RommPlayComponent } from '../romm-play/romm-play.component';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-romm-skeleton',
  standalone: true,
  imports: [RommPlayComponent, NgIf],
  templateUrl: './romm-skeleton.component.html',
  styleUrl: './romm-skeleton.component.css'
})
export class RommSkeletonComponent implements OnInit {
  roomId: number | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.roomId = id ? Number(id) : undefined;  // Convertir en number seulement si id existe
    console.log('Room ID:', this.roomId);
  }
}
