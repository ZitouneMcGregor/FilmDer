import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.css'
})
export class RegisterModalComponent {

  constructor( private router: Router) {}

  @Output() switch = new EventEmitter<void>();

  onSubmit(): void {
    console.log('Inscription ok');
    this.router.navigateByUrl('/home')
  }

  onSwitch(): void {
    this.switch.emit();
  }
}