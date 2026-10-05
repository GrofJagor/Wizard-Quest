import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { Wizard } from '../../models/wizard';
import { AppState } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { selectWizardById } from '../../store/wizard.selectors';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, startWith, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import * as WizardActions from "../../store/wizard.actions";
import * as TowerActions from "../../store/tower.actions";
import { UserProfileView } from '../../models/user.profile';
import { UserService } from '../../services/user';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Quest } from '../../models/quest';
import { QuestService } from '../../services/quest';
import { WizardService } from '../../services/wizard';

interface ProfileViewModel {
  profile: UserProfileView | null;
  loading: boolean;
  error: string | null;
  canEdit: boolean;
}
  
interface WizardEditForm {
  name: string;
  affinity: string;
  pictureUrl: string;
}
  
interface TowerEditForm {
  name: string;
  rank: string;
}
  
@Component({
  selector: "app-wizard-profile",
  standalone: false,
  styleUrl: "./wizard-profile.scss",
  templateUrl: "./wizard-profile.html",
})
export class WizardProfile implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private userService = inject(UserService);
  private questService = inject(QuestService);
  private wizardService = inject(WizardService);
  private actions$ = inject(Actions);
  private destroyRef = inject(DestroyRef);
  
  authService = inject(AuthService);
  
  vm$: Observable<ProfileViewModel> = of({
    profile: null,
    loading: true,
    error: null,
    canEdit: false,
  });
  
  completedQuests$: Observable<Quest[]> = of([]);
  activeQuest$: Observable<Quest | null> = of(null);
  towerActiveQuests$: Observable<Quest[]> = of([]);
  
  editMode = false;
  wizardForm: WizardEditForm = { name: "", affinity: "", pictureUrl: "" };
  towerForm: TowerEditForm = { name: "", rank: "" };
  
  private refresh$ = new BehaviorSubject<void>(undefined);
  
  ngOnInit(): void {
    const profileFetch$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get("user");
        
        if (!id) {
          return of({ profile: null, loading: false, error: "No profile id in the route." });
        }

        return this.refresh$.pipe(
          switchMap(() =>
            this.userService.getById(id).pipe(
              map((profile) => ({ profile, loading: false, error: null as string | null })),
              catchError(() =>
                of({ profile: null, loading: false, error: "Profile not found." })
              ),
              startWith({ profile: null, loading: true, error: null as string | null })
            )
          )
        );
      })
    );
  
    const profileOnly$ = profileFetch$.pipe(map(({ profile }) => profile));
  
    this.vm$ = combineLatest([profileFetch$, this.authService.currentUser$]).pipe(
      map(([{ profile, loading, error }, currentUser]) => ({
        profile,
        loading,
        error,
        canEdit: !!profile && !!currentUser && currentUser.id === profile.id,
      }))
    );
  
    this.completedQuests$ = profileOnly$.pipe(
      switchMap((profile) => {
        if (!profile) return of<Quest[]>([]);
        if (profile.role === "WIZARD") {
          return this.questService.getCompletedForWizard(profile.id);
        }
        return this.questService.getCreatedByTower(profile.id).pipe(
          map((quests) => {
            return quests.filter((q) => q.status === "COMPLETED");
          })
        );
      })
    );
  
    this.activeQuest$ = profileOnly$.pipe(
      switchMap((profile) => {
        if (!profile || profile.role !== "WIZARD") return of<null>(null);
        return this.wizardService.getById(profile.id).pipe(map((w) => w.activeQuest ?? null));
      })
    );

    this.towerActiveQuests$ = profileOnly$.pipe(
      switchMap((profile) => {
        if (!profile || profile.role !== "TOWER") return of<Quest[]>([]);
        return this.questService.getCreatedByTower(profile.id).pipe(
          map((quests) => quests.filter((q) => q.status === "IN_PROGRESS" || q.status === "OPEN"))
        );
      })
    );

    this.actions$
      .pipe(
        ofType(WizardActions.updateWizardProfileSuccess, TowerActions.updateTowerProfileSuccess),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.refresh$.next());
  }
  
  startEdit(profile: UserProfileView): void {
    this.editMode = true;
    if (profile.role === "WIZARD") {
      this.wizardForm = {
        name: profile.name,
        affinity: profile.affinity,
        pictureUrl: profile.pictureUrl,
      };
    } else {
      this.towerForm = { name: profile.name, rank: profile.rank };
    }
  }
  
  cancelEdit(): void {
    this.editMode = false;
  }
  
  saveWizard(profile: UserProfileView): void {
    if (profile.role !== "WIZARD") return;
    this.store.dispatch(
      WizardActions.updateWizardProfile({
        id: profile.id,
        payload: { ...this.wizardForm },
      })
    );
    this.editMode = false;
  }
  
  saveTower(profile: UserProfileView): void {
    if (profile.role !== "TOWER") return;
    this.store.dispatch(
      TowerActions.updateTowerProfile({
        id: profile.id,
        payload: { ...this.towerForm },
      })
    );
    this.editMode = false;
  }
  
  getXpClamped(xp: number): number {
    return Math.min(100, Math.max(1, xp || 0));
  }


levelClass(level: string): string {
  switch (level?.toLowerCase()) {
    case 'easy': return 'level-easy';
    case 'medium': return 'level-medium';
    case 'hard': return 'level-hard';
    case 'deadly': return 'level-deadly';
    default: return '';
  }
}

statusClass(status: string): string {
  switch (status?.toLowerCase()) {
    case 'open': return 'status-open';
    case 'in_progress': return 'status-in-progress';
    case 'completed': return 'status-completed';
    default: return '';
  }
}

statusLabel(status: string): string {
  switch (status?.toLowerCase()) {
    case 'open': return 'Open';
    case 'in_progress': return 'In Progress';
    case 'completed': return 'Completed';
    default: return status;
  }
}
}