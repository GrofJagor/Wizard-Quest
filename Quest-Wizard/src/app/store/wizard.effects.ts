import { Injectable, inject } from "@angular/core";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as WizardActions from "./wizard.actions";
import { WizardsService } from "../services/wizard";

@Injectable()
export class WizardsEffects {
  private actions$ = inject(Actions);
  private wizardsService = inject(WizardsService);

  loadWizards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WizardActions.loadWizards),
      switchMap(() =>
        this.wizardsService.getAll().pipe(
          map((wizards) => WizardActions.loadWizardsSuccess({ wizards })),
          catchError((error: unknown) =>
            of(
              WizardActions.loadWizardsFailure({
                error: error instanceof Error ? error.message : String(error),
              })
            )
          )
        )
      )
    )
  );
}