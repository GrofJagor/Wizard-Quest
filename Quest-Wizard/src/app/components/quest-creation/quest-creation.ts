import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Quest, QuestLevel } from '../../models/quest';
import { Wizard } from '../../models/wizard';
import { ReactiveFormsModule } from '@angular/forms';



export const MOCK_WIZARDS: Wizard[] = [
  {
    id: "1",
    name: 'Merlin Sylver',
    level: 85,
    affinity: 'Arcane',
    xp: 245000
  },
  {
    id: "2",
    name: 'Ignis Ashworth',
    level: 42,
    affinity: 'Fire',
    xp: 68400
  },
  {
    id: "3",
    name: 'Gala Stormweaver',
    level: 67,
    affinity: 'Lightning',
    xp: 152300
  },
  {
    id: "4",
    name: 'Lyra Deepwater',
    level: 29,
    affinity: 'Water',
    xp: 31200
  },
  {
    id: "5",
    name: 'Terran Ironroot',
    level: 55,
    affinity: 'Earth',
    xp: 98900
  },
  {
    id: "6",
    name: 'Zephyr Windrider',
    level: 12,
    affinity: 'Air',
    xp: 8500
  },
  {
    id: "7",
    name: 'Morgana Shadowend',
    level: 99,
    affinity: 'Necromancy',
    xp: 489000
  }
];

const LEVELS: QuestLevel[] = ['EASY', 'MEDIUM', 'HARD','DEADLY'];

@Component({
  selector: 'app-quest-creation',
  standalone: false,
  styleUrl: './quest-creation.scss',
  templateUrl: './quest-creation.html',
})
export class QuestCreation 
 {
   /** Emits a fully-built quest whenever the form is submitted successfully. */
    private fb = inject(FormBuilder);
  @Output() questCreated = new EventEmitter<Quest>();

  readonly levels = LEVELS;
  readonly wizards = MOCK_WIZARDS;
 
  /** Chosen wizard ids, kept outside the form group and synced from the picker. */
  selectedWizardIds: string[] = [];
 
  /** True once the user has tried to submit, so picker errors only show then. */
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
      wizards: openToAll ? [] : [...this.selectedWizardIds],
      
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