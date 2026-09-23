import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: false,
  styleUrl: './login-form.scss',
  templateUrl: './login-form.html',
})
export class LoginForm {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
 
  loading = false;
  errorMessage: string | null = null;
 
  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
  });
 
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
 
    this.loading = true;
    this.errorMessage = null;
 
    const { email, password } = this.form.getRawValue();
 
    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(["/"]);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = "Invalid email or password. The tower gates remain shut.";
      },
    });
  }
}
