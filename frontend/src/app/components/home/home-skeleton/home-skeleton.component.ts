import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-skeleton',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-skeleton.component.html',
  styleUrl: './home-skeleton.component.css'
})
export class HomeSkeletonComponent {
  defaultText: string = `
  <p class='text-xl'>Marre de passer des heures à batailler avec vos amis ou votre famille pour choisir un film ?</p>
  <p class='text-xl'>Marre de ne pas trouver de nouveaux films correspondant à vos goûts ?</p>
  <h1 class='font-bold text-4xl my-10'>FilmDer est LA SOLUTION !</h1>
  <p>Ajouter les films que vous aimez et on vous en suggère de nouveaux --></p>
  <p><-- Lancer des parties avec vos proches pour décider quel film vous allez regarder ce soir</p>
`;

middleText: string = this.defaultText;

updateText(type: string) {
  if (type === 'match') {
    this.middleText = `<p>Marre de débattre pendant des heures pour choisir un film à regarder ? Match est là pour vous !<p/>
    
    <p>🎭 Rejoignez une session avec vos amis et laissez l’algorithme générer une sélection basée sur vos goûts communs.<p/>

    <p>🎲 Créez et gérez vos propres parties, invitez vos proches et trouvez facilement le film idéal.<p/>

💡 <p>Avec Match, plus besoin de se prendre la tête, laissez la magie opérer et profitez du film parfait pour tout le monde ! 🎥</p>`;
  } else if (type === 'films') {
    this.middleText = `<p>Organisez votre collection de films en toute simplicité !<p/>

    <p>📌 Ajoutez des films à votre liste personnelle et attribuez-leur une note.<p/>

    <p>🔍 Recherchez de nouveaux films et enrichissez votre bibliothèque.<p/>

    <p>⭐ Notez et classez vos visionnages pour mieux retrouver vos coups de cœur.<p/>

<p>🎞️ Gardez une trace de tous les films que vous avez regardés et découvrez-en de nouveaux !</p>`;
  }
}

resetText() {
  this.middleText = this.defaultText;
}
}
