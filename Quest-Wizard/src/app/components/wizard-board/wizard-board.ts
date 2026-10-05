import { Component, inject, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "../../store/app-state";
import { BehaviorSubject, Observable, combineLatest, map, of } from "rxjs";
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
  
  // Search state subject
  protected searchQuery$ = new BehaviorSubject<string>('');

  authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(Store<AppState>);

  ngOnInit(): void {
    const rawWizards$ = this.store.select(selectAllWizards);

    // Combine wizards with search input to filter by name or affinity
    this.wizards = combineLatest([
      rawWizards$,
      this.searchQuery$
    ]).pipe(
      map(([wizardsList, query]) => {
        if (!wizardsList) return null;
        const searchTerm = query.toLowerCase().trim();
        if (!searchTerm) return wizardsList;

        return wizardsList.filter(wizard => 
          wizard.name.toLowerCase().includes(searchTerm) || 
          (wizard.affinity && wizard.affinity.toLowerCase().includes(searchTerm))
        );
      })
    );
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery$.next(input.value);
  }

  getXpClamped(xp: number): number {
    return Math.min(100, Math.max(1, xp || 0));
  }

  onMoreInfo(wizard: Wizard, event: Event): void {
    event.stopPropagation();
    this.router.navigate(["/profile", wizard.id]);
  }
}