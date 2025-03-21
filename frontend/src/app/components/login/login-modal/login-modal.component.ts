import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../../../services/user/user-service.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private userService: UserServiceService) {}

  @Output() switch = new EventEmitter<void>();

  onSubmit(): void {
    this.userService.login(this.username, this.password).subscribe(isAuthenticated => {
      if (isAuthenticated) {
        console.log('Connexion réussie');
        this.router.navigateByUrl('/home');
      } else {
        console.log('Échec de la connexion');
      }
    });
  }

  onSwitch(): void {
    this.switch.emit();
  }
}