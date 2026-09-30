import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Quest, QuestStatus } from "../models/quest";
import {   QuestsState, selectAllQuestsRaw, selectQuestEntities, } from "./quest.reducer";
import { AppState } from "./app-state";


export const selectQuestState = createFeatureSelector<QuestsState>("quests");
 
export const selectAllQuests = createSelector(selectQuestState, selectAllQuestsRaw);
 
export const selectQuestsEntities = createSelector(selectQuestState, selectQuestEntities);
 
export const selectQuestsLoading = createSelector(selectQuestState, (state) => state.loading);
 
export const selectQuestsError = createSelector(selectQuestState, (state) => state.error);
 
export const selectQuestById = (questId: number) =>
  createSelector(selectQuestsEntities, (entities) => entities[questId] ?? null);
 
// ---- status-based filters (derived from whatever's currently in the entity
// collection — pair with loadQuestsByStatus if you want to guarantee the
// backend's full set for a given status is actually loaded first) ----
 
export const selectQuestsByStatus = (status: QuestStatus) =>
  createSelector(selectAllQuests, (quests) => quests.filter((q) => q.status === status));
 
export const selectOpenStatusQuests = selectQuestsByStatus("OPEN");
export const selectInProgressQuests = selectQuestsByStatus("IN_PROGRESS");
export const selectCompletedStatusQuests = selectQuestsByStatus("COMPLETED");
 
// ---- `open` (acceptable) vs `status` (lifecycle) are different fields on
// purpose — see the note in quest.entity.ts on the backend. This filters on
// the boolean, independent of where the quest sits in its status lifecycle. ----
 
export const selectAcceptableQuests = createSelector(selectAllQuests, (quests) =>
  quests.filter((q) => q.open)
);
 