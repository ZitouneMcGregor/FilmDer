import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserServiceService } from '../services/user/user-service.service';
import { Room } from '../services/room/room-service.service';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {
  rooms: Room[] = [];
  userId: number = Number(localStorage.getItem('UserId'));

  constructor(private userService: UserServiceService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getRoomsHistoByUserId(this.userId).subscribe({
        next: (rooms: Room[]) => {
          this.rooms = rooms;
        },
        error: (err) => {
          console.error("Erreur lors de la récupération de l'historique des parties :", err);
        }
      });
    }
  }
}
