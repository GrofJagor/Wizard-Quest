import { createAction, props } from "@ngrx/store";
import { Quest } from "../models/quest";




export const loadQuests=createAction(
    "Load Quests",
)

export const loadQuestsSuccess=createAction(
    "Load Quests Success",
    props<{
quests:Quest[];
    }>()
)

export const loadQuestsFailure = createAction(
  '[Quests] Load Quests Failure',
  props<{ error: string }>()
);

