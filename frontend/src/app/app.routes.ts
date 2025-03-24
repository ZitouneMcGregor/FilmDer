import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { HomeSkeletonComponent } from './components/home/home-skeleton/home-skeleton.component';
import { LoginSkeletonComponent } from './components/login/login-skeleton/login-skeleton.component';
import { PlaySkeletonComponent } from './components/play/play-skeleton/play-skeleton.component';
import { FilmsSkeletonComponent } from './components/films/films-skeleton/films-skeleton.component';
import { AuthGuard } from './guards/authGuard/auth-guard.guard';
import { LoginGuard } from './guards/loginGuard/login-guard.guard';
import { RommPlayComponent } from './components/room/romm-play/romm-play.component';
import { ResultatsComponent } from './components/room/romm-result/romm-result.component';

export const routes: Routes = [
    { path: 'home', component: HomeSkeletonComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginSkeletonComponent, canActivate: [LoginGuard]},
    { path: 'play', component: PlaySkeletonComponent, canActivate: [AuthGuard]},
    { path: 'films', component: FilmsSkeletonComponent, canActivate: [AuthGuard]},
    { path: 'resultats', component: ResultatsComponent},
    { path: '',   redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent }
    
];