import { Component } from '@angular/core';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-skeleton',
  standalone: true,
  imports: [LoginModalComponent,RegisterModalComponent,CommonModule],
  templateUrl: './login-skeleton.component.html',
  styleUrl: './login-skeleton.component.css'
})
export class LoginSkeletonComponent {

  isLogin: boolean = true;

  toggle(): void {
    this.isLogin = !this.isLogin;
  }

}
