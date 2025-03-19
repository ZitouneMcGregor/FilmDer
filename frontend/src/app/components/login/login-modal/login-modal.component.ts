import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent {

  constructor( private router: Router ) {}

  @Output() switch = new EventEmitter<void>();

  onSubmit(): void {
    console.log('Connexion ok');
    this.router.navigateByUrl('/home')
  }

  onSwitch(): void {
    this.switch.emit();
  }
}
