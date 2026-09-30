import { Component, inject, Input, OnInit } from '@angular/core';
import { Wizard } from '../../models/wizard';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { selectWizardById } from '../../store/wizard.selectors';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-wizard-profile',
  standalone: false,
  styleUrl: './wizard-profile.scss',
  templateUrl: './wizard-profile.html',
})
export class WizardProfile implements OnInit {

  wizard1: Observable<Wizard | null> = of(null);

  authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(Store<AppState>); 

  ngOnInit(): void {
   
    const userProfile = this.route.snapshot.paramMap.get('user')?.toUpperCase();
    
    if (userProfile) {
     
      this.wizard1 = this.store.select(selectWizardById(userProfile));
    }
  }

  getXpClamped(xp: number): number {
    return Math.min(100, Math.max(1, xp || 0));
  }
}