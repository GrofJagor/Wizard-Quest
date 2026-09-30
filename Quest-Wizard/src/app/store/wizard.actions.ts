import { createAction, props } from "@ngrx/store";
import { Wizard } from "../models/wizard";
import { UpdateWizardProfilePayload } from "../services/wizard";

 
// ---- load all ----
 
export const loadWizards = createAction("[Wizards] Load Wizards");
 
export const loadWizardsSuccess = createAction(
  "[Wizards] Load Wizards Success",
  props<{ wizards: Wizard[] }>()
);
 
export const loadWizardsFailure = createAction(
  "[Wizards] Load Wizards Failure",
  props<{ error: string }>()
);
 
// ---- load one ----
 
export const loadWizardById = createAction(
  "[Wizards] Load Wizard By Id",
  props<{ id: string }>()
);
 
export const loadWizardByIdSuccess = createAction(
  "[Wizards] Load Wizard By Id Success",
  props<{ wizard: Wizard }>()
);
 
export const loadWizardByIdFailure = createAction(
  "[Wizards] Load Wizard By Id Failure",
  props<{ error: string }>()
);
 
// ---- load wizards with no active quest ----
 
export const loadWizardsWithoutActiveQuest = createAction(
  "[Wizards] Load Wizards Without Active Quest"
);
 
export const loadWizardsWithoutActiveQuestSuccess = createAction(
  "[Wizards] Load Wizards Without Active Quest Success",
  props<{ wizards: Wizard[] }>()
);
 
export const loadWizardsWithoutActiveQuestFailure = createAction(
  "[Wizards] Load Wizards Without Active Quest Failure",
  props<{ error: string }>()
);
 
// ---- update profile ----
 
export const updateWizardProfile = createAction(
  "[Wizards] Update Wizard Profile",
  props<{ id: string; payload: UpdateWizardProfilePayload }>()
);
 
export const updateWizardProfileSuccess = createAction(
  "[Wizards] Update Wizard Profile Success",
  props<{ wizard: Wizard }>()
);
 
export const updateWizardProfileFailure = createAction(
  "[Wizards] Update Wizard Profile Failure",
  props<{ error: string }>()
);
 
// ---- delete ----
 
export const deleteWizard = createAction("[Wizards] Delete Wizard", props<{ id: string }>());
 
export const deleteWizardSuccess = createAction(
  "[Wizards] Delete Wizard Success",
  props<{ id: string }>()
);
 
export const deleteWizardFailure = createAction(
  "[Wizards] Delete Wizard Failure",
  props<{ error: string }>()
);