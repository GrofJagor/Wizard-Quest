import { Component, Input } from '@angular/core';
import { Wizard } from '../../models/wizard';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { selectWizardById } from '../../store/wizard.selectors';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-wizard-profile',
  standalone: false,
  styleUrl: './wizard-profile.scss',
  templateUrl: './wizard-profile.html',
})
export class WizardProfile {

  @Input()wizard1: Observable<Wizard | null> = of(null);
  @Input({ required: true }) wizard!: Wizard;

  constructor(private store: Store<AppState>){};
 
  get xpClamped(): number {
    return Math.min(100, Math.max(1, this.wizard.xp));
  }


    ngOnInit(): void {
   // this.store.dispatch(QuestActions.loadQuests());
    this.wizard1 = this.store.select(selectWizardById("wiz-001"));
    //this.wizard.forEach(quest=>console.log(quest));
    
  }
}