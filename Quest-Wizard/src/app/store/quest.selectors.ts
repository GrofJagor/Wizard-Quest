import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Quest } from "../models/quest";
import { QuestsState, selectAll } from "./quest.reducer";
import { AppState } from "./app-state";




export const selectQuestState = createFeatureSelector<QuestsState>("quests");


export const selectAllQuests = createSelector(
  selectQuestState,
  selectAll
);



export const selectSelectedQuestId = createSelector(
  selectQuestState,
  (state) => state.selectedQuestId
);