import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as QuestActions from '../../store/quest.actions';
import { BehaviorSubject, Observable, combineLatest, map, of } from 'rxjs';
import { Quest, QuestStatus } from '../../models/quest';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { selectAllQuests, selectOpenOrInProgressQuests, selectOpenStatusQuests } from '../../store/quest.selectors';
import { loadQuests } from '../../store/quest.actions';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface BoardUser {
  id: string;
  role: "WIZARD" | "TOWER";
}

type SortColumn = 'tower' | 'title' | 'level' | 'reward' | 'wizards' | 'status' | null;
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-quest-board',
  standalone: false,
  styleUrl: './quest-board.scss',
  templateUrl: './quest-board.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestBoard implements OnInit, OnChanges {
  @Input() quests: Quest[] | null = null;
  @Input() interactive = true;
  @Input() wizardsDisplay: "active" | "completed" = "active";
  @Input() hideWizardsColumn = false;
 
  private store = inject(Store);
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
 
  displayQuests$!: Observable<Quest[]>;
  private selfManaged = false;
  private inputQuests$ = new BehaviorSubject<Quest[]>([]);
  
  // Search & Sorting state subjects
  protected searchQuery$ = new BehaviorSubject<string>('');
  protected sortColumn$ = new BehaviorSubject<SortColumn>(null);
  protected sortDirection$ = new BehaviorSubject<SortDirection>('asc');
 
  currentUser: BoardUser | null = null;
 
  ngOnInit(): void {
    this.selfManaged = this.quests === null;

    let baseQuests$: Observable<Quest[]>;
    if (this.selfManaged) {
      this.store.dispatch(QuestActions.loadQuestsByStatus({ status: "OPEN" }));
      this.store.dispatch(QuestActions.loadQuestsByStatus({ status: "IN_PROGRESS" }));
      baseQuests$ = this.store.select(selectOpenOrInProgressQuests);
    } else {
      this.inputQuests$.next(this.quests ?? []);
      baseQuests$ = this.inputQuests$.asObservable();
    }

    // Combine source quests with search query and sorting rules
    this.displayQuests$ = combineLatest([
      baseQuests$,
      this.searchQuery$,
      this.sortColumn$,
      this.sortDirection$
    ]).pipe(
      map(([quests, query, column, direction]) => {
        // 1. Filter by search query (checks title or creator tower name)
        const searchTerm = query.toLowerCase().trim();
        const filtered = searchTerm
          ? quests.filter(quest => 
              quest.title.toLowerCase().includes(searchTerm) || 
              (quest.createdByTower?.name && quest.createdByTower.name.toLowerCase().includes(searchTerm))
            )
          : quests;

        // 2. Sort filtered quests if a sort column is active
        if (!column) return filtered;

        return [...filtered].sort((a, b) => {
          let valA: any = this.getSortValue(a, column);
          let valB: any = this.getSortValue(b, column);

          if (valA === valB) return 0;
          if (valA === null || valA === undefined) return 1;
          if (valB === null || valB === undefined) return -1;

          const comparison = valA < valB ? -1 : 1;
          return direction === 'asc' ? comparison : -comparison;
        });
      })
    );
 
    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef)) 
      .subscribe((user) => {
        this.currentUser = user ? { id: user.id, role: user.role } : null;
      });
  }
 
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.selfManaged && changes["quests"]) {
      this.inputQuests$.next(this.quests ?? []);
    }
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery$.next(input.value);
  }

  onSort(column: SortColumn): void {
    const currentColumn = this.sortColumn$.value;
    const currentDir = this.sortDirection$.value;

    if (currentColumn === column) {
      if (currentDir === 'asc') {
        this.sortDirection$.next('desc');
      } else {
        this.sortColumn$.next(null);
        this.sortDirection$.next('asc');
      }
    } else {
      this.sortColumn$.next(column);
      this.sortDirection$.next('asc');
    }
  }

  getSortIndicator(column: SortColumn): string {
    const activeColumn = this.sortColumn$.value;
    const direction = this.sortDirection$.value;

    if (activeColumn !== column) {
      return '↕';
    }
    return direction === 'asc' ? '▲' : '▼';
  }

  private getSortValue(quest: Quest, column: SortColumn): any {
    switch (column) {
      case 'tower':
        return quest.createdByTower?.name?.toLowerCase() || '';
      case 'title':
        return quest.title?.toLowerCase() || '';
      case 'level':
        const difficultyWeights: { [key: string]: number } = {
          'easy': 1,
          'medium': 2,
          'hard': 3,
          'deadly': 4
        };
        const levelKey = quest.level?.toLowerCase() || '';
        return difficultyWeights[levelKey] ?? 99;
      case 'reward':
        return quest.reward ?? 0;
      case 'wizards':
        const list = this.wizardsColumnList(quest);
        return list.length > 0 ? list[0].name.toLowerCase() : '';
      case 'status':
        return quest.status || '';
      default:
        return '';
    }
  }
 
  get isWizardView(): boolean {
    return this.interactive && this.currentUser?.role === "WIZARD";
  }
 
  get isTowerView(): boolean {
    return this.interactive && this.currentUser?.role === "TOWER";
  }

  get showWizardsColumn(): boolean {
    return !this.hideWizardsColumn;
  }

  calculateColspan(): number {
    let count = 5;
    if (this.showWizardsColumn) {
      count++; 
    }
    if (this.interactive) {
      count++;
    }
    return count;
  }
 
  isAssigned(quest: Quest): boolean {
    return !!this.currentUser && quest.activeWizards.some((w) => w.id === this.currentUser!.id);
  }
 
  wizardsColumnHeader(): string {
    return this.wizardsDisplay === "completed" ? "Completed By" : "Assigned Wizards";
  }
 
  wizardsColumnList(quest: Quest) {
    return this.wizardsDisplay === "completed" ? quest.completedByWizards : quest.activeWizards;
  }
 
  statusLabel(status: QuestStatus): string {
    switch (status) {
      case "OPEN":
        return "Open";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
    }
  }
 
  statusClass(status: QuestStatus): string {
    return "status-" + status.toLowerCase().replace("_", "-");
  }
 
  levelClass(level: string): string {
    return "level-" + level.toLowerCase();
  }
 
  onJoin(quest: Quest, event: Event): void {
    event.stopPropagation();
    if (!this.currentUser) return;
    this.store.dispatch(
      QuestActions.joinQuest({ questId: quest.id, wizardId: this.currentUser.id })
    );
  }
 
  onLeave(quest: Quest, event: Event): void {
    event.stopPropagation();
    if (!this.currentUser) return;
    this.store.dispatch(
      QuestActions.leaveQuest({ questId: quest.id, wizardId: this.currentUser.id })
    );
  }
 
  onMoreInfo(quest: Quest, event: Event): void {
    event.stopPropagation();
    this.router.navigate(["/quests", quest.id]);
  }
 
  onEdit(quest: Quest, event: Event): void {
    event.stopPropagation();
    this.router.navigate(["/quests", quest.id]);
  }

  onStart(quest: Quest, event: Event): void {
    event.stopPropagation();
    this.store.dispatch(QuestActions.startQuest({ questId: quest.id }));
  }
 
  onConclude(quest: Quest, event: Event): void {
    event.stopPropagation();
    this.store.dispatch(QuestActions.concludeQuest({ questId: quest.id }));
  }
 
  onDelete(quest: Quest, event: Event): void {
    event.stopPropagation();
    if (confirm(`Delete "${quest.title}"? This cannot be undone.`)) {
      this.store.dispatch(QuestActions.deleteQuest({ id: quest.id }));
    }
  }
}