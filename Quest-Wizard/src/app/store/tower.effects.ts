import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TowerService } from "../services/tower";
import { catchError, map, of, switchMap } from "rxjs";
import * as TowerActions from "./tower.actions";
function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
 
@Injectable()
export class TowersEffects {
  private actions$ = inject(Actions);
  private towerService = inject(TowerService);
 
  loadTowers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TowerActions.loadTowers),
      switchMap(() =>
        this.towerService.getAll().pipe(
          map((towers) => TowerActions.loadTowersSuccess({ towers })),
          catchError((error: unknown) =>
            of(TowerActions.loadTowersFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
 
  loadTowerById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TowerActions.loadTowerById),
      switchMap(({ id }) =>
        this.towerService.getById(id).pipe(
          map((tower) => TowerActions.loadTowerByIdSuccess({ tower })),
          catchError((error: unknown) =>
            of(TowerActions.loadTowerByIdFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
 
  updateTowerProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TowerActions.updateTowerProfile),
      switchMap(({ id, payload }) =>
        this.towerService.updateProfile(id, payload).pipe(
          map((tower) => TowerActions.updateTowerProfileSuccess({ tower })),
          catchError((error: unknown) =>
            of(TowerActions.updateTowerProfileFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
}