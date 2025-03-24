import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RommPlayComponent } from '../romm-play/romm-play.component';

@Component({
  selector: 'app-romm-skeleton',
  standalone: true,
  imports: [RommPlayComponent],
  templateUrl: './romm-skeleton.component.html',
  styleUrl: './romm-skeleton.component.css'
})
export class RommSkeletonComponent implements OnInit {
  roomId: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.roomId = id ? Number(id) : null;  // Convertir en number seulement si id existe
    console.log('Room ID:', this.roomId);
  }
}
