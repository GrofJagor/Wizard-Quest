import { Component, ChangeDetectorRef, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Quest, QuestLevel } from '../../models/quest';
import { Wizard } from '../../models/wizard';
import { ReactiveFormsModule } from '@angular/forms';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { selectAllWizards, selectWizardsWithoutActiveQuest } from '../../store/wizard.selectors';
import { faGlassMartiniAlt } from '@fortawesome/free-solid-svg-icons';
import se from '@angular/common/locales/se';
import { selectAllQuests } from '../../store/quest.selectors';
import { selectAllWizardViews } from '../../store/quest-wizard.selectors';
import * as QuestActions from "../../store/quest.actions";
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { WizardService } from '../../services/wizard';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const QUEST_LEVELS: QuestLevel[] = ["EASY", "MEDIUM", "HARD", "DEADLY"];

@Component({
  selector: 'app-quest-creation',
  standalone: false,
  styleUrl: './quest-creation.scss',
  templateUrl: './quest-creation.html',
})
export class QuestCreation implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private store = inject(Store);
  private actions$ = inject(Actions);
  private wizardService = inject(WizardService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  
  readonly levels = QUEST_LEVELS;
  
  availableWizards: Wizard[] = [];
  selectedWizardIds: string[] = [];
  private loadedAvailableWizards = false;
  
  loading = false;
  errorMessage: string | null = null;
  
  form = this.fb.group({
    title: ["", Validators.required],
    level: ["EASY" as QuestLevel, Validators.required],
    patron: ["", Validators.required],
    description: ["", Validators.required],
    reward: [0, [Validators.required, Validators.min(0)]],
    open: [true],
  });
  
  get isOpen(): boolean {
    return !!this.form.get("open")?.value;
  }
  
  ngOnInit(): void {
    this.form
      .get("open")
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((open) => {
        if (!open && !this.loadedAvailableWizards) {
          this.loadedAvailableWizards = true;
          this.wizardService
            .getAvailableForAssignment()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((wizards) => {
              this.availableWizards = wizards;
              this.cdr.markForCheck();
            });
        }
      });

    this.actions$
      .pipe(ofType(QuestActions.createQuestSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ quest }) => {
        this.loading = false;
        this.router.navigate(["/quests", quest.id]);
      });
  
    this.actions$
      .pipe(ofType(QuestActions.createQuestFailure), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ error }) => {
        this.loading = false;
        this.errorMessage = error || "Failed to create the quest. Please try again.";
      });
  }
  
  onWizardSelectionChange(ids: string[]): void {
    this.selectedWizardIds = ids;
  }
  
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    const isOpen = this.isOpen;
  
    if (!isOpen && this.selectedWizardIds.length === 0) {
      this.errorMessage = "Select at least one wizard to assign before posting.";
      return;
    }
  
    this.errorMessage = null;
    this.loading = true;
  
    const raw = this.form.getRawValue();
  
    this.store.dispatch(
      QuestActions.createQuest({
        payload: {
          title: raw.title!,
          level: raw.level!,
          patron: raw.patron!,
          description: raw.description!,
          reward: raw.reward!,
          open: isOpen,
          assignedWizardIds: isOpen ? undefined : this.selectedWizardIds,
        },
      })
    );
  }
}