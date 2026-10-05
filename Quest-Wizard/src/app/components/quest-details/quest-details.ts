import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { Quest, QuestLevel } from '../../models/quest';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../../services/auth';
import { Observable, of } from 'rxjs';
import * as QuestActions from "../../store/quest.actions";
import { selectQuestById } from '../../store/quest-wizard.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UpdateQuestPayload } from '../../services/quest';

interface InfoUser {
  id: string;
  role: "WIZARD" | "TOWER";
}
 
interface EditForm {
  title: string;
  level: QuestLevel;
  patron: string;
  description: string;
  reward: number;
  open: boolean;
}
 
const QUEST_LEVELS: QuestLevel[] = ["EASY", "MEDIUM", "HARD", "DEADLY"];

@Component({
  selector: 'app-quest-details',
  standalone: false,
  styleUrl: './quest-details.scss',
  templateUrl: './quest-details.html',
})
export class QuestDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
 
  readonly levels = QUEST_LEVELS;
 
  questId: number | null = null;
  quest$: Observable<Quest | null> = of(null);
  currentUser: InfoUser | null = null;
 
  editMode = false;
  editForm: EditForm = {
    title: "",
    level: "EASY",
    patron: "",
    description: "",
    reward: 0,
    open: true,
  };
 
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id");
    this.questId = idParam ? Number(idParam) : null;
 
    if (this.questId !== null) {
      this.store.dispatch(QuestActions.loadQuestById({ id: this.questId }));
      this.quest$ = this.store.select(selectQuestById(this.questId));
    }
 
    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.currentUser = user ? { id: user.id, role: user.role } : null;
      });
  }
 
  isWizard(): boolean {
    return this.currentUser?.role === "WIZARD";
  }
 
  isOwningTower(quest: Quest): boolean {
    return this.currentUser?.role === "TOWER" && quest.createdByTower?.id === this.currentUser.id;
  }
 
  isAssigned(quest: Quest): boolean {
    return !!this.currentUser && quest.activeWizards.some((w) => w.id === this.currentUser!.id);
  }
 
  startEdit(quest: Quest): void {
    this.editForm = {
      title: quest.title,
      level: quest.level,
      patron: quest.patron,
      description: quest.description,
      reward: quest.reward,
      open: quest.open,
    };
    this.editMode = true;
  }
 
  cancelEdit(): void {
    this.editMode = false;
  }
 
  saveEdit(): void {
    if (this.questId === null) return;
    const payload: UpdateQuestPayload = { ...this.editForm };
    this.store.dispatch(QuestActions.updateQuest({ id: this.questId, payload }));
    this.editMode = false;
  }
 
  join(): void {
    if (this.questId === null || !this.currentUser) return;
    this.store.dispatch(
      QuestActions.joinQuest({ questId: this.questId, wizardId: this.currentUser.id })
    );
  }
 
  leave(): void {
    if (this.questId === null || !this.currentUser) return;
    this.store.dispatch(
      QuestActions.leaveQuest({ questId: this.questId, wizardId: this.currentUser.id })
    );
  }
 
  start(): void {
    if (this.questId === null) return;
    this.store.dispatch(QuestActions.startQuest({ questId: this.questId }));
  }
 
  conclude(): void {
    if (this.questId === null) return;
    this.store.dispatch(QuestActions.concludeQuest({ questId: this.questId }));
  }
 
  remove(quest: Quest): void {
    if (confirm(`Delete "${quest.title}"? This cannot be undone.`)) {
      this.store.dispatch(QuestActions.deleteQuest({ id: quest.id }));
      this.router.navigate(["/"]);
    }
  }
 
  statusLabel(status: string): string {
    switch (status) {
      case "OPEN":
        return "Open";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  }
}
 
