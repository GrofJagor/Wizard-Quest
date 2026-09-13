import { Injectable, inject } from "@angular/core";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as QuestActions from "./quest.actions";
import { QuestsService } from "../services/quest";

@Injectable()
export class QuestsEffect {
  private actions$ = inject(Actions);
  private questsService = inject(QuestsService);

  loadEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestActions.loadQuests),
      switchMap(() =>
        this.questsService.getAll().pipe(
          map((quests) => QuestActions.loadQuestsSuccess({ quests })),
          catchError((error: unknown) =>
            of(
              QuestActions.loadQuestsFailure({
                error: error instanceof Error ? error.message : String(error),
              })
            )
          )
        )
      )
    )
  );
}

