import { Component, EventEmitter, inject, Output } from '@angular/core';
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





const LEVELS: QuestLevel[] = ['EASY', 'MEDIUM', 'HARD','DEADLY'];

@Component({
  selector: 'app-quest-creation',
  standalone: false,
  styleUrl: './quest-creation.scss',
  templateUrl: './quest-creation.html',
})

export class QuestCreation 
 {
    private store = inject(Store<AppState>);
    private fb = inject(FormBuilder);
  @Output() questCreated = new EventEmitter<Quest>();

  readonly levels = LEVELS;
  readonly wizards = this.store.select(selectWizardsWithoutActiveQuest);
  
 

  selectedWizardIds: string[] = [];
  submitAttempted = false;
  
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    level: ['EASY' as QuestLevel, Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]],
    reward: [100, [Validators.required, Validators.min(0)]],
    openToAll: [true],
  });
  
 
  get openToAll(): boolean {
    return !!this.form.get('openToAll')?.value;
  }
 
  get needsWizardSelection(): boolean {
    return !this.openToAll && this.submitAttempted && this.selectedWizardIds.length === 0;
  }
 
  onWizardSelectionChange(ids: string[]): void {
    this.selectedWizardIds = ids;
  }
 
  onOpenToAllChange(): void {
    // Clear any picks left over from a previous "invite specific wizards" pass.
    if (this.openToAll) {
      this.selectedWizardIds = [];
    }
  }
 
  submit(): void {
    this.submitAttempted = true;
    
 
    const wizardSelectionValid = this.openToAll || this.selectedWizardIds.length > 0;
 
    if (this.form.invalid || !wizardSelectionValid) {
      this.form.markAllAsTouched();
      return;
    }
 
    const { title, level, description, reward, openToAll } = this.form.getRawValue();
 
    const quest: Quest = {
      id:1,
      patron:"a1",
      status:"OPEN",
      title: title!.trim(),
      level: level as QuestLevel,
      description: description!.trim(),
      reward: reward!,
      open: openToAll!,
      createdByTower: {
        id: "1",
        email:"gmail@gmail.com",
        rank: "L",
        name:"name",
      },
     // wizards: openToAll ? [] : [...this.selectedWizardIds],
      completedByWizards:[],
      activeWizards:[]
    };
 

    this.questCreated.emit(quest);
    this.resetForm();
  }
 
  private resetForm(): void {
    this.form.reset({ title: '', level: 'EASY', description: '', reward: 100, openToAll: true });
    this.selectedWizardIds = [];
    this.submitAttempted = false;
  }
}