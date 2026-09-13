
import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as QuestActions from '../../store/quest.actions';
import { Observable, of } from 'rxjs';
import { Quest } from '../../models/quest';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { selectAllQuests } from '../../store/quest.selectors';
import { loadQuests } from '../../store/quest.actions';

@Component({
  selector: 'app-quest-board',
  standalone: false,
  styleUrl: './quest-board.scss',
  templateUrl: './quest-board.html',
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class QuestBoard implements OnInit{

  quests: Observable<readonly Quest[]> = of([]);
    @Output() onSelectedMovie: EventEmitter<string> = new EventEmitter<string>();

 constructor(private store: Store<AppState>) {

  }

  ngOnInit(): void {
   // this.store.dispatch(QuestActions.loadQuests());
    this.quests = this.store.select(selectAllQuests);
    this.quests.forEach(quest=>console.log(quest));
    
  }

}