import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/shared/header/header.component";
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';


  
    constructor(private userService: UserService, private router: Router) {}
  
    ngOnInit(): void {
      const isLogged = this.userService.isLoggedIn();
      const currentRoute = this.router.url;
  
      const isProtectedRoute = !['/login', '/register'].includes(currentRoute);
  
      if (!isLogged && isProtectedRoute) {
        this.router.navigate(['/login']);
      }
    }
  }
  

