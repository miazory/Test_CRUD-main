import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationService);

  readonly form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  error = '';

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/employees']);
    }
  }

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.value;
    const loggedIn = this.authService.login(username ?? '', password ?? '');
    if (loggedIn) {
      this.notificationService.push('success', 'Login berhasil.');
      const redirect = this.route.snapshot.queryParamMap.get('redirect');
      this.router.navigate([redirect || '/employees']);
    } else {
      this.error = 'Username atau password salah.';
      this.notificationService.push('danger', this.error);
    }
  }
}
