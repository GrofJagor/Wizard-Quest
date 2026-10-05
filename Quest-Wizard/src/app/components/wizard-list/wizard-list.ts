import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Wizard } from '../../models/wizard';
import { WizardService } from '../../services/wizard';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-wizard-list',
  standalone: false,
  styleUrl: './wizard-list.scss',
  templateUrl: './wizard-list.html',
})
export class WizardList implements OnInit, OnChanges {
  @Input() wizards: Wizard[] | null = null;
  @Input() selectable = false;
  @Output() selectionChange = new EventEmitter<string[]>();
 
  private wizardService = inject(WizardService);
 
  displayWizards$!: Observable<Wizard[]>;
  private inputWizards$ = new BehaviorSubject<Wizard[]>([]);
  private selfManaged = false;
  
  // Search query state subject
  protected searchQuery$ = new BehaviorSubject<string>('');
 
  selectedIds = new Set<string>();
 
  ngOnInit(): void {
    this.selfManaged = this.wizards === null;

    let baseWizards$: Observable<Wizard[]>;
    if (this.selfManaged) {
      baseWizards$ = this.wizardService.getAll();
    } else {
      this.inputWizards$.next(this.wizards ?? []);
      baseWizards$ = this.inputWizards$.asObservable();
    }

    // Combine wizards stream with search input filtering
    this.displayWizards$ = combineLatest([
      baseWizards$,
      this.searchQuery$
    ]).pipe(
      map(([wizards, query]) => {
        const searchTerm = query.toLowerCase().trim();
        if (!searchTerm) return wizards;

        return wizards.filter(wizard => 
          wizard.name.toLowerCase().includes(searchTerm) || 
          (wizard.affinity && wizard.affinity.toLowerCase().includes(searchTerm))
        );
      })
    );
  }
 
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.selfManaged && changes["wizards"]) {
      this.inputWizards$.next(this.wizards ?? []);
      const stillValid = new Set(
        (this.wizards ?? []).map((w) => w.id).filter((id) => this.selectedIds.has(id))
      );
      if (stillValid.size !== this.selectedIds.size) {
        this.selectedIds = stillValid;
        this.selectionChange.emit(Array.from(this.selectedIds));
      }
    }
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery$.next(input.value);
  }
 
  toggle(wizardId: string): void {
    if (!this.selectable) return;
    if (this.selectedIds.has(wizardId)) {
      this.selectedIds.delete(wizardId);
    } else {
      this.selectedIds.add(wizardId);
    }
    this.selectionChange.emit(Array.from(this.selectedIds));
  }
 
  isSelected(wizardId: string): boolean {
    return this.selectedIds.has(wizardId);
  }
 
  initial(name: string): string {
    return name.charAt(0).toUpperCase();
  }
}