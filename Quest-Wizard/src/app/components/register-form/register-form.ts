import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRole } from '../../models/auth';
import { NotificationService } from '../../notification.service';

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
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService)

  private initialRole = (this.route.snapshot.paramMap.get('user')?.toUpperCase() as UserRole) || 'WIZARD';
  loading = false;
  errorMessage: string | null = null;

  form = this.fb.group({
    role: [this.initialRole, [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
    name: [""],
    affinity: [""],
  });

  get isWizard(): boolean {
    return this.form.get("role")?.value === "WIZARD";
  }

  submit(): void {
    const nameControl = this.form.get("name");
    const affinityControl = this.form.get("affinity");

    nameControl?.addValidators(Validators.required);

    if (this.isWizard) {
      affinityControl?.addValidators(Validators.required);
    } else {
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
        name: raw.name || undefined, 
        affinity: raw.role === "WIZARD" ? raw.affinity! : undefined,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(["/"]);
        },
        error: (err) => {
          this.loading = false;
          if(err?.status===409){
            this.notificationService.showNotification("That sigil (email) is already bound to another account.")
          }
          else{
            this.notificationService.showNotification("The ritual failed. Check your details and try again.")
          }
        },
      });
  }
}
