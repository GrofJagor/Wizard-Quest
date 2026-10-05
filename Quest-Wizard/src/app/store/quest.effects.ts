import { Injectable, inject } from "@angular/core";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as QuestActions from "./quest.actions";
import * as RelActions from "./quest-wizard.actions";
import { QuestService } from "../services/quest";
import { NotificationService } from "../notification.service";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
 
@Injectable()
export class QuestsEffects {
  private actions$ = inject(Actions);
  private questService = inject(QuestService);
  private notificationService = inject(NotificationService)
 
  loadQuests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestActions.loadQuests),
      switchMap(() =>
        this.questService.getAll().pipe(
          map((quests) => QuestActions.loadQuestsSuccess({ quests })),
          catchError((error: unknown) =>
            of(QuestActions.loadQuestsFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
 
  loadQuestById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestActions.loadQuestById),
      switchMap(({ id }) =>
        this.questService.getById(id).pipe(
          map((quest) => QuestActions.loadQuestByIdSuccess({ quest })),
          catchError((error: unknown) =>
            of(QuestActions.loadQuestByIdFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
 
  loadQuestsByStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestActions.loadQuestsByStatus),
      switchMap(({ status }) =>
        this.questService.getByStatus(status).pipe(
          map((quests) => QuestActions.loadQuestsByStatusSuccess({ quests })),
          catchError((error: unknown) =>
            of(QuestActions.loadQuestsByStatusFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
 
  loadCompletedQuestsForWizard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestActions.loadCompletedQuestsForWizard),
      switchMap(({ wizardId }) =>
        this.questService.getCompletedForWizard(wizardId).pipe(
          map((quests) => QuestActions.loadCompletedQuestsForWizardSuccess({ quests })),
          catchError((error: unknown) =>
            of(QuestActions.loadCompletedQuestsForWizardFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
 
  loadQuestsCreatedByTower$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestActions.loadQuestsCreatedByTower),
      switchMap(({ towerId }) =>
        this.questService.getCreatedByTower(towerId).pipe(
          map((quests) => QuestActions.loadQuestsCreatedByTowerSuccess({ quests })),
          catchError((error: unknown) =>
            of(QuestActions.loadQuestsCreatedByTowerFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
 
  createQuest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestActions.createQuest),
      switchMap(({ payload }) =>
        this.questService.create(payload).pipe(
          map((quest) => QuestActions.createQuestSuccess({ quest })),
          catchError((error: unknown) =>
            of(QuestActions.createQuestFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
 
  updateQuest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestActions.updateQuest),
      switchMap(({ id, payload }) =>
        this.questService.update(id, payload).pipe(
          map((quest) => QuestActions.updateQuestSuccess({ quest })),
          catchError((error: unknown) =>
            of(QuestActions.updateQuestFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
 
  deleteQuest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestActions.deleteQuest),
      switchMap(({ id }) =>
        this.questService.delete(id).pipe(
          map(() => QuestActions.deleteQuestSuccess({ id })),
          catchError((error: unknown) =>
            of(QuestActions.deleteQuestFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
 
  joinQuest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestActions.joinQuest),
      switchMap(({ questId, wizardId }) =>
        this.questService.join(questId, wizardId).pipe(
          map((quest) => QuestActions.joinQuestSuccess({ quest, wizardId })),
          catchError((error: any) => {
            if (error?.status === 400) {
              const customMessage = error.error?.message || "You cannot join another quest until you complete your current quest.";
              this.notificationService.showNotification(customMessage);
            }
            return of(QuestActions.joinQuestFailure({ error: errorMessage(error) }));
          })
        )
      )
    )
  );
 
  leaveQuest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestActions.leaveQuest),
      switchMap(({ questId, wizardId }) =>
        this.questService.leave(questId).pipe(
          map((quest) => QuestActions.leaveQuestSuccess({ quest, wizardId })),
          catchError((error: unknown) =>
            of(QuestActions.leaveQuestFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
 
  startQuest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestActions.startQuest),
      switchMap(({ questId }) =>
        this.questService.start(questId).pipe(
          map((quest) => QuestActions.startQuestSuccess({ quest })),
          catchError((error: unknown) =>
            of(QuestActions.startQuestFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
 
  concludeQuest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestActions.concludeQuest),
      switchMap(({ questId }) =>
        this.questService.conclude(questId).pipe(
          map((quest) => QuestActions.concludeQuestSuccess({ quest })),
          catchError((error: unknown) =>
            of(QuestActions.concludeQuestFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
}
 