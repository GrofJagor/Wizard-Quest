import { createAction, props } from "@ngrx/store";
import { Wizard } from "../models/wizard";

 
export const loadWizards = createAction("[Wizards] Load Wizards");
 
export const loadWizardsSuccess = createAction(
  "[Wizards] Load Wizards Success",
  props<{ wizards: Wizard[] }>()
);
 
export const loadWizardsFailure = createAction(
  "[Wizards] Load Wizards Failure",
  props<{ error: string }>()
);
 