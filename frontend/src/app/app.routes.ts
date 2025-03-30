import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { HomeSkeletonComponent } from './components/home/home-skeleton/home-skeleton.component';
import { LoginSkeletonComponent } from './components/login/login-skeleton/login-skeleton.component';
import { PlaySkeletonComponent } from './components/play/play-skeleton/play-skeleton.component';
import { FilmsSkeletonComponent } from './components/films/films-skeleton/films-skeleton.component';
import { AuthGuard } from './guards/authGuard/auth-guard.guard';
import { LoginGuard } from './guards/loginGuard/login-guard.guard';
import { RoomPlayComponent } from './components/room/room-play/room-play.component';
import { ProfilSkeletonComponent } from './components/profil/profil-skeleton/profil-skeleton.component';
import { RoomSkeletonComponent } from './components/room/room-skeleton/room-skeleton.component';
import { RoomResultComponent } from './components/room/room-result/room-result.component';
import { RoomGuard } from './guards/roomGuard/room-guard.guard';
import { HistoriqueComponent } from './components/historique/historique.component';


export const routes: Routes = [
    { path: 'home', component: HomeSkeletonComponent, canActivate: [ AuthGuard ] },
    { path: 'login', component: LoginSkeletonComponent, canActivate: [ LoginGuard ]},
    { path: 'play', component: PlaySkeletonComponent, canActivate: [ AuthGuard ]},
    { path: 'films', component: FilmsSkeletonComponent, canActivate: [ AuthGuard ]},
    { path: 'profil', component: ProfilSkeletonComponent, canActivate: [ AuthGuard ]},
    { path: 'room/:id', component: RoomSkeletonComponent, canActivate:  [ AuthGuard, RoomGuard ]},
    {path: 'result/:id', component: RoomResultComponent, canActivate: [AuthGuard]},
    {path: 'historique', component: HistoriqueComponent, canActivate: [AuthGuard]},
    { path: '',   redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent }
    
];