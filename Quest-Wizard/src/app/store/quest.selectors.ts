import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Quest } from "../models/quest";
import {   QuestsState, selectAllQuestsRaw, selectQuestEntities, } from "./quest.reducer";
import { AppState } from "./app-state";




// export const selectQuestState = createFeatureSelector<QuestsState>("quests");


// export const selectAllQuests = createSelector(
//   selectQuestState,
//   selectAll
// );



// export const selectSelectedQuestId = createSelector(
//   selectQuestState,
//   (state) => state.selectedQuestId
// );


export const selectQuestState = createFeatureSelector<QuestsState>("quests");
 
export const selectAllQuests = createSelector(selectQuestState, selectAllQuestsRaw);
 
export const selectQuestsEntities = createSelector(
  selectQuestState,
  selectQuestEntities
);
 
export const selectQuestsLoading = createSelector(
  selectQuestState,
  (state) => state.loading
);
 
export const selectQuestsError = createSelector(
  selectQuestState,
  (state) => state.error
);
 
export const selectQuestById = (questId: number) =>
  createSelector(selectQuestsEntities, (entities) => entities[questId] ?? null);
 
export const selectOpenQuests = createSelector(selectAllQuests, (quests) =>
  quests.filter((q) => q.open)
);
 