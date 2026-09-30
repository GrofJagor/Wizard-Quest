import { Component, inject, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "../../store/app-state";
import { Observable, of } from "rxjs";
import { selectAllWizards } from "../../store/wizard.selectors";
import { Wizard } from "../../models/wizard";


@Component({
  selector: 'app-wizard-board',
  standalone: false,
  styleUrl: './wizard-board.scss',
  templateUrl: './wizard-board.html',
})


export class WizardBoard implements OnInit {
  
  wizards: Observable<Wizard[] | null> = of(null);

  authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(Store<AppState>);

  ngOnInit(): void {
   
    this.wizards = this.store.select(selectAllWizards);
  }

  getXpClamped(xp: number): number {
    return Math.min(100, Math.max(1, xp || 0));
  }
}