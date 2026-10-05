import { Injectable, inject } from "@angular/core";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as WizardActions from "./wizard.actions";
import { WizardService } from "../services/wizard";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
 
@Injectable()
export class WizardsEffects {
  private actions$ = inject(Actions);
  private wizardService = inject(WizardService);
 
  loadWizards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WizardActions.loadWizards),
      switchMap(() =>
        this.wizardService.getAll().pipe(
          map((wizards) => WizardActions.loadWizardsSuccess({ wizards })),
          catchError((error: unknown) =>
            of(WizardActions.loadWizardsFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
 
  loadWizardById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WizardActions.loadWizardById),
      switchMap(({ id }) =>
        this.wizardService.getById(id).pipe(
          map((wizard) => WizardActions.loadWizardByIdSuccess({ wizard })),
          catchError((error: unknown) =>
            of(WizardActions.loadWizardByIdFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
 
  loadWizardsWithoutActiveQuest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WizardActions.loadWizardsWithoutActiveQuest),
      switchMap(() =>
        this.wizardService.getWithoutActiveQuest().pipe(
          map((wizards) => WizardActions.loadWizardsWithoutActiveQuestSuccess({ wizards })),
          catchError((error: unknown) =>
            of(WizardActions.loadWizardsWithoutActiveQuestFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
 
  updateWizardProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WizardActions.updateWizardProfile),
      switchMap(({ id, payload }) =>
        this.wizardService.updateProfile(id, payload).pipe(
          map((wizard) => WizardActions.updateWizardProfileSuccess({ wizard })),
          catchError((error: unknown) =>
            of(WizardActions.updateWizardProfileFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
 
  deleteWizard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WizardActions.deleteWizard),
      switchMap(({ id }) =>
        this.wizardService.delete(id).pipe(
          map(() => WizardActions.deleteWizardSuccess({ id })),
          catchError((error: unknown) =>
            of(WizardActions.deleteWizardFailure({ error: errorMessage(error) }))
          )
        )
      )
    )
  );
}