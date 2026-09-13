import { Component, Input } from '@angular/core';
import { Quest } from '../../models/quest';

@Component({
  selector: 'app-quest-details',
  standalone: false,
  styleUrl: './quest-details.scss',
  templateUrl: './quest-details.html',
})
export class QuestDetails {
    @Input() quest: Quest | null = null;

      constructor() { }

        ngOnInit(): void {

  }
}

