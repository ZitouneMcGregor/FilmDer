import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RommPlayComponent } from "../romm-play/romm-play.component";

@Component({
  selector: 'app-romm-skeleton',
  standalone: true,
  imports: [RommPlayComponent],
  templateUrl: './romm-skeleton.component.html',
  styleUrl: './romm-skeleton.component.css'
})
export class RommSkeletonComponent {
  @Input() roomId!: number;


  
}
