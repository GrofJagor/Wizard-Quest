import { Injectable, inject } from "@angular/core";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as QuestActions from "./quest.actions";
import * as RelActions from "./quest-wizard.actions";
import { QuestsService } from "../services/quest";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
 
@Injectable()
export class QuestsEffects {
  private actions$ = inject(Actions);
  private questService = inject(QuestsService);
 
  loadQuests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestActions.loadQuests),
      switchMap(() =>
        this.questService.getAll().pipe(
          map((quests) => QuestActions.loadQuestsSuccess({ quests })),
          catchError((error: unknown) => of(QuestActions.loadQuestsFailure({ error: errorMessage(error) })))
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
      ofType(RelActions.joinQuest),
      switchMap(({ questId, wizardId }) =>
        this.questService.join(questId, wizardId).pipe(
          map((quest) => RelActions.joinQuestSuccess({ quest, wizardId })),
          catchError((error: unknown) =>
            of(RelActions.joinQuestFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
}
 