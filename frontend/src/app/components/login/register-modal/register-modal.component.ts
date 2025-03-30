import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.css'
})
export class RegisterModalComponent {
  pseudo: string = '';
  password: string = '';
  passwordConfirm: string = '';

  constructor(private router: Router, private userService: UserService) {}

  
  @Output() switch = new EventEmitter<void>();

  onSubmit(): void {
    if (this.password !== this.passwordConfirm) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    const newUser = {
      pseudo: this.pseudo,
      u_password: this.password
    };

    this.userService.registerUser(newUser).subscribe({
      next: (response) => {
        console.log('Inscription réussie', response);
        alert("Inscription réussie");
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        console.error('Erreur d\'inscription', err);
        if (err.status === 400 && err.error.detail === 'Le pseudo est déjà pris.') {
          alert('Le pseudo est déjà pris. Veuillez en choisir un autre.');
        } else {
          alert('Erreur lors de l\'inscription');
        }
      }
    });
    }

  onSwitch(): void {
    this.switch.emit();
  }
}