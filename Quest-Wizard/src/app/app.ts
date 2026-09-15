import { Component, NgModule, signal, isDevMode, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Store } from '@ngrx/store';
import { AppState } from './store/app-state';
import * as QuestActions from './store/quest.actions';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('Quest-Wizard');

 constructor(private store: Store<AppState>){};
  ngOnInit() {
    this.store.dispatch(QuestActions.loadQuests());
  }

}

