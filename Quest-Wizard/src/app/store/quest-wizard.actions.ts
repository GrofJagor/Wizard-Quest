import { createAction, props } from "@ngrx/store";
 

 
export const assignActiveQuest = createAction(
  "[Quest/Wizard] Assign Active Quest",
  props<{ questId: number; wizardId: string }>()
);
 
export const completeQuest = createAction(
  "[Quest/Wizard] Complete Quest",
  props<{ questId: number; wizardId: string }>()
);
 
export const abandonActiveQuest = createAction(
  "[Quest/Wizard] Abandon Active Quest",
  props<{ questId: number; wizardId: string }>()
);
 