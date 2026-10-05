import { createAction, props } from "@ngrx/store";
import { Tower } from "../models/tower";
import { UpdateTowerProfilePayload } from "../services/tower";

export const loadTowers = createAction("[Towers] Load Towers");
 
export const loadTowersSuccess = createAction(
  "[Towers] Load Towers Success",
  props<{ towers: Tower[] }>()
);
 
export const loadTowersFailure = createAction(
  "[Towers] Load Towers Failure",
  props<{ error: string }>()
);
 
export const loadTowerById = createAction("[Towers] Load Tower By Id", props<{ id: string }>());
 
export const loadTowerByIdSuccess = createAction(
  "[Towers] Load Tower By Id Success",
  props<{ tower: Tower }>()
);
 
export const loadTowerByIdFailure = createAction(
  "[Towers] Load Tower By Id Failure",
  props<{ error: string }>()
);
 
export const updateTowerProfile = createAction(
  "[Towers] Update Tower Profile",
  props<{ id: string; payload: UpdateTowerProfilePayload }>()
);
 
export const updateTowerProfileSuccess = createAction(
  "[Towers] Update Tower Profile Success",
  props<{ tower: Tower }>()
);
 
export const updateTowerProfileFailure = createAction(
  "[Towers] Update Tower Profile Failure",
  props<{ error: string }>()
);
 