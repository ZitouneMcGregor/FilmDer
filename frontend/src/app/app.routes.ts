import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { HomeSkeletonComponent } from './components/home/home-skeleton/home-skeleton.component';
import { LoginSkeletonComponent } from './components/login/login-skeleton/login-skeleton.component';
import { PlaySkeletonComponent } from './components/play/play-skeleton/play-skeleton.component';
import { FilmsSkeletonComponent } from './components/films/films-skeleton/films-skeleton.component';

export const routes: Routes = [
    { path: 'home', component: HomeSkeletonComponent },
    { path: 'login', component: LoginSkeletonComponent },
    { path: 'play', component: PlaySkeletonComponent},
    { path: 'films', component: FilmsSkeletonComponent},
    { path: '',   redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent }
];