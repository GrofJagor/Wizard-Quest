import { createAction, props } from "@ngrx/store";
import { Quest } from "../models/quest";
import { Wizard } from "../models/wizard";
 

 


export const joinQuest = createAction(
  "[Quest/Wizard] Join Quest",
  props<{ questId: number; wizardId: string }>()
);
 
export const joinQuestSuccess = createAction(
  "[Quest/Wizard] Join Quest Success",
  props<{ quest: Quest; wizardId: string }>()
);
 
export const joinQuestFailure = createAction(
  "[Quest/Wizard] Join Quest Failure",
  props<{ error: string }>()
);
 

export const assignActiveQuest = createAction(
  "[Quest/Wizard] Assign Active Quest",
  props<{ questId: number; wizard: Wizard }>()
);
 
export const completeQuest = createAction(
  "[Quest/Wizard] Complete Quest",
  props<{ questId: number; wizard: Wizard }>()
);
 
export const abandonActiveQuest = createAction(
  "[Quest/Wizard] Abandon Active Quest",
  props<{ questId: number; wizard: Wizard }>()
);
 