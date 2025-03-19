import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilmsCardComponent } from '../films-card/films-card.component';

interface Film {
  image: string;
  name: string;
  note: number;
}

@Component({
  selector: 'app-films-skeleton',
  standalone: true,
  imports: [CommonModule, FormsModule, FilmsCardComponent],
  templateUrl: './films-skeleton.component.html',
  styleUrl: './films-skeleton.component.css'
})
export class FilmsSkeletonComponent {
  films: Film[] = [
    { image: 'https://media.licdn.com/dms/image/v2/D4D03AQHLlRVKLpgtQQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718375806960?e=1747872000&v=beta&t=rh3xSWSHKUbvuObtEBRSDLyq5ge2zx696pd4_keCLpM', name: 'Film Zit', note: 10 },
    { image: 'https://media.licdn.com/dms/image/v2/D4E03AQFYS6ejT-G0og/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1669554107446?e=1747872000&v=beta&t=wRxP7AqdN3tRWmORI3hi4RDPbgKPN3EkYUxV4sRKFcQ', name: 'Film Omar', note: 10 },
    { image: 'https://media.licdn.com/dms/image/v2/D4E03AQGVYpKuu3tgyw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1708893515270?e=1747872000&v=beta&t=hWldBga6QoypRqYown4FpmVmSWLGmsbY9cLORiYg_SM', name: 'Film Clem', note: 10 },
    { image: 'https://media.licdn.com/dms/image/v2/D4E03AQE5DosK7Es6gA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1671209736093?e=1747872000&v=beta&t=3-zt7el3agI7_o8o_E0rpRqol7HSAFehNiTehGmhGqg', name: 'Film Jerem', note: 10 },
  ];

  newFilmSearch: string = '';

  addFilm(): void {
    console.log('Ajouter nouveau film : ', this.newFilmSearch);
    this.newFilmSearch = '';
  }
}