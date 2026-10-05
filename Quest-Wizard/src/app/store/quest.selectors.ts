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
 
export const selectQuestsByStatus = (status: QuestStatus) =>
  createSelector(selectAllQuests, (quests) => quests.filter((q) => q.status === status));
 
export const selectOpenStatusQuests = selectQuestsByStatus("OPEN");
export const selectInProgressQuests = selectQuestsByStatus("IN_PROGRESS");
export const selectCompletedStatusQuests = selectQuestsByStatus("COMPLETED");
 
export const selectOpenOrInProgressQuests = createSelector(selectAllQuests, (quests) =>
  quests.filter((q) => q.status === "OPEN" || q.status === "IN_PROGRESS")
);
 
export const selectAcceptableQuests = createSelector(selectAllQuests, (quests) =>
  quests.filter((q) => q.open)
);