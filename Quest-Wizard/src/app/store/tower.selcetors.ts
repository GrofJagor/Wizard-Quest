import { createFeatureSelector, createSelector } from "@ngrx/store";
import { selectAllTowersRaw, selectTowerEntities, TowersState } from "./tower.reducer";

export const selectTowerState = createFeatureSelector<TowersState>("towers");
 
export const selectAllTowers = createSelector(selectTowerState, selectAllTowersRaw);
 
export const selectTowersEntities = createSelector(selectTowerState, selectTowerEntities);
 
export const selectTowersLoading = createSelector(selectTowerState, (state) => state.loading);
 
export const selectTowersError = createSelector(selectTowerState, (state) => state.error);
 
export const selectTowerById = (towerId: string) =>
  createSelector(selectTowersEntities, (entities) => entities[towerId] ?? null);
 