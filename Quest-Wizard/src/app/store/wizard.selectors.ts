import { createFeatureSelector, createSelector } from "@ngrx/store";
import {
  WizardsState,
  selectAllWizardsRaw,
  selectWizardEntities,
} from "./wizard.reducer";

export const selectWizardState = createFeatureSelector<WizardsState>("wizards");
 
export const selectAllWizards = createSelector(selectWizardState, selectAllWizardsRaw);
 
export const selectWizardsEntities = createSelector(selectWizardState, selectWizardEntities);
 
export const selectWizardsLoading = createSelector(selectWizardState, (state) => state.loading);
 
export const selectWizardsError = createSelector(selectWizardState, (state) => state.error);
 
export const selectWizardById = (wizardId: string) =>
  createSelector(selectWizardsEntities, (entities) => entities[wizardId] ?? null);
 
export const selectWizardsWithoutActiveQuest = createSelector(selectAllWizards, (wizards) =>
  wizards.filter((w) => w.activeQuestId === null || w.activeQuestId === undefined)
);
 
 