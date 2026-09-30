import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";

import * as WizardActions from "./wizard.actions";
import * as RelActions from "./quest-wizard.actions";
import { Wizard } from "../models/wizard";


export interface WizardsState extends EntityState<Wizard> {
  loading: boolean;
  error: string | null;
}
 
export const wizardAdapter = createEntityAdapter<Wizard>();
 
export const initialState: WizardsState = wizardAdapter.getInitialState({
  loading: false,
  error: null,
});
 
export const wizardsReducer = createReducer(
  initialState,
 
 
  on(WizardActions.loadWizards, (state) => ({ ...state, loading: true, error: null })),
 
  on(WizardActions.loadWizardsSuccess, (state, { wizards }) =>
    wizardAdapter.setAll(wizards, { ...state, loading: false })
  ),
 
  on(WizardActions.loadWizardsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
 
 
  on(WizardActions.loadWizardById, (state) => ({ ...state, loading: true, error: null })),
  on(WizardActions.loadWizardByIdSuccess, (state, { wizard }) =>
    wizardAdapter.upsertOne(wizard, { ...state, loading: false })
  ),
  on(WizardActions.loadWizardByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
 
 
  on(WizardActions.loadWizardsWithoutActiveQuest, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WizardActions.loadWizardsWithoutActiveQuestSuccess, (state, { wizards }) =>
    wizardAdapter.upsertMany(wizards, { ...state, loading: false })
  ),
  on(WizardActions.loadWizardsWithoutActiveQuestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
 
 
  on(WizardActions.updateWizardProfile, (state) => ({ ...state, loading: true, error: null })),
  on(WizardActions.updateWizardProfileSuccess, (state, { wizard }) =>
    wizardAdapter.upsertOne(wizard, { ...state, loading: false })
  ),
  on(WizardActions.updateWizardProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
 
  on(WizardActions.deleteWizard, (state) => ({ ...state, loading: true, error: null })),
  on(WizardActions.deleteWizardSuccess, (state, { id }) =>
    wizardAdapter.removeOne(id, { ...state, loading: false })
  ),
  on(WizardActions.deleteWizardFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(RelActions.joinQuestSuccess, (state, { quest, wizardId }) =>
    wizardAdapter.updateOne({ id: wizardId, changes: { activeQuestId: quest.id } }, state)
  ),
 

  on(RelActions.assignActiveQuest, (state, { questId, wizard }) =>
    wizardAdapter.updateOne({ id: wizard.id, changes: { activeQuestId: questId } }, state)
  ),
 
  on(RelActions.completeQuest, (state, { questId, wizard }) => {
    const existing = state.entities[wizard.id];
    if (!existing) return state;
 
    const completedQuestIds = existing.completedQuestIds ?? [];
 
    return wizardAdapter.updateOne(
      {
        id: wizard.id,
        changes: {
          activeQuestId: existing.activeQuestId === questId ? null : existing.activeQuestId,
          completedQuestIds: completedQuestIds.includes(questId)
            ? completedQuestIds
            : [...completedQuestIds, questId],
        },
      },
      state
    );
  }),
 
  on(RelActions.abandonActiveQuest, (state, { questId, wizard }) => {
    const existing = state.entities[wizard.id];
    if (!existing || existing.activeQuestId !== questId) return state;
 
    return wizardAdapter.updateOne({ id: wizard.id, changes: { activeQuestId: null } }, state);
  })
);
 
export const {
  selectAll: selectAllWizardsRaw,
  selectEntities: selectWizardEntities,
  selectIds: selectWizardIds,
  selectTotal: selectWizardTotal,
} = wizardAdapter.getSelectors();