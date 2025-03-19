import { Component, Input } from '@angular/core';

interface Film {
  image: string;
  name: string;
  note: number;
}

@Component({
  selector: 'app-films-card',
  standalone: true,
  imports: [],
  templateUrl: './films-card.component.html',
  styleUrl: './films-card.component.css'
})
export class FilmsCardComponent {
  @Input() film!: Film;
}