import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Quest, QuestLevel } from '../../models/quest';
import { Wizard } from '../../models/wizard';
import { ReactiveFormsModule } from '@angular/forms';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { selectAllWizards } from '../../store/wizard.selectors';



// export const MOCK_WIZARDS: Wizard[] = [
//   {
//     id: "wiz-001",
//     name: "Eldrin Stormweaver",
//     level: 14,
//     affinity: "Lightning",
//     xp: 72,
//     completedQuests: [
//       {
//         id: 101,
//         title: "The Spark of Awakening",
//         level: "EASY",
//         patron: "user_archmage_99",
//         description: "Retrieve the charged crystal from the Thunder Peaks.",
//         reward: 150,
//         wizards: ["wiz-001"],
//         status: "COMPLETED",
//         open: false
//       },
//       {
//         id: 102,
//         title: "Calming the Tempest",
//         level: "MEDIUM",
//         patron: "user_king_arthur",
//         description: "Help the village of Oakhaven stop an unnatural storm.",
//         reward: 500,
//         wizards: ["wiz-001", "wiz-003"],
//         status: "COMPLETED",
//         open: false
//       }
//     ],
//     activeQuest: {
//       id: 201,
//       title: "Charging the Monolith",
//       level: "HARD",
//       patron: "user_council_elder",
//       description: "Channel 10,000 volts of pure energy into the ancient spire.",
//       reward: 1200,
//       wizards: ["wiz-001"],
//       status: "IN_PROGRESS",
//       open: false
//     },
//     pictureUrl: "https://example.com"
//   },
//   {
//     id: "wiz-002",
//     name: "Morgath the Shadowweaver",
//     level: 28,
//     affinity: "Necromancy",
//     xp: 45,
//     completedQuests: [
//       {
//         id: 88,
//         title: "Graveyard Shift",
//         level: "MEDIUM",
//         patron: "user_necromancer_lord",
//         description: "Animate 50 skeletons for the castle defense.",
//         reward: 350,
//         wizards: ["wiz-002"],
//         status: "COMPLETED",
//         open: false
//       }
//     ],
//     activeQuest: null,
//     pictureUrl: "https://example.com"
//   }
// ];

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
  readonly wizards = this.store.select(selectAllWizards);;
 

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
     // wizards: openToAll ? [] : [...this.selectedWizardIds],
      completedByWizardIds:[],
      activeWizardIds:[]
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