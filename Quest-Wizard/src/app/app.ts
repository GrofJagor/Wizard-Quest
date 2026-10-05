import { Component, NgModule, signal, isDevMode, OnInit, inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Store } from '@ngrx/store';
import { AppState } from './store/app-state';
import * as QuestActions from './store/quest.actions';
import * as WizardActions from './store/wizard.actions';
import { Wizard } from './models/wizard';
import { Observable, of } from 'rxjs';
import { selectAllWizards } from './store/wizard.selectors';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private notificationService = inject(NotificationService);
  readonly notificationMessage = this.notificationService.message;
  readonly showNotification = this.notificationService.show;
  protected readonly title = signal('Quest-Wizard');
  constructor(private store: Store<AppState>){};
  wizards: Observable<readonly Wizard[]> = of([]);              
  ngOnInit() {
    this.store.dispatch(QuestActions.loadQuests());
    this.store.dispatch(WizardActions.loadWizards());
    this.wizards = this.store.select(selectAllWizards);
    
  }

}

