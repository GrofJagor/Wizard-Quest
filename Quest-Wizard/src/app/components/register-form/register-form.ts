import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { UserRole } from '../../models/auth';

@Component({
  selector: 'app-register-form',
  standalone: false,
  styleUrl: './register-form.scss',
  templateUrl: './register-form.html',
})
export class RegisterForm {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
 
  loading = false;
  errorMessage: string | null = null;
 
  form = this.fb.group({
    role: ["WIZARD" as UserRole, [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
    name: [""],
    affinity: [""],
  });
 
  get isWizard(): boolean {
    return this.form.get("role")?.value === "WIZARD";
  }
 
  submit(): void {
    // name/affinity are only required when registering as a Wizard
    const nameControl = this.form.get("name");
    const affinityControl = this.form.get("affinity");
 
    if (this.isWizard) {
      nameControl?.addValidators(Validators.required);
      affinityControl?.addValidators(Validators.required);
    } else {
      nameControl?.clearValidators();
      affinityControl?.clearValidators();
    }
    nameControl?.updateValueAndValidity();
    affinityControl?.updateValueAndValidity();
 
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
 
    this.loading = true;
    this.errorMessage = null;
 
    const raw = this.form.getRawValue();
 
    this.authService
      .register({
        email: raw.email!,
        password: raw.password!,
        role: raw.role!,
        name: raw.role === "WIZARD" ? raw.name! : undefined,
        affinity: raw.role === "WIZARD" ? raw.affinity! : undefined,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(["/"]);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage =
            err?.status === 409
              ? "That sigil (email) is already bound to another account."
              : "The ritual failed. Check your details and try again.";
        },
      });
  }
}