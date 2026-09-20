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

  on(WizardActions.loadWizards, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(WizardActions.loadWizardsSuccess, (state, { wizards }) =>
    wizardAdapter.setAll(wizards, { ...state, loading: false })
  ),

  on(WizardActions.loadWizardsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // --- shared relationship actions ---

  // many-to-one enforced here: setting activeQuestId always REPLACES
  // whatever value was there before, never appends.
  on(RelActions.assignActiveQuest, (state, { questId, wizardId }) =>
    wizardAdapter.updateOne(
      { id: wizardId, changes: { activeQuestId: questId } },
      state
    )
  ),

  on(RelActions.completeQuest, (state, { questId, wizardId }) => {
    const wizard = state.entities[wizardId];
    if (!wizard) return state;

    return wizardAdapter.updateOne(
      {
        id: wizardId,
        changes: {
          activeQuestId: wizard.activeQuestId === questId ? null : wizard.activeQuestId,
          completedQuestIds: wizard.completedQuestIds.includes(questId)
            ? wizard.completedQuestIds
            : [...wizard.completedQuestIds, questId],
        },
      },
      state
    );
  }),

  on(RelActions.abandonActiveQuest, (state, { questId, wizardId }) => {
    const wizard = state.entities[wizardId];
    if (!wizard || wizard.activeQuestId !== questId) return state;

    return wizardAdapter.updateOne(
      { id: wizardId, changes: { activeQuestId: null } },
      state
    );
  })
);

export const {
  selectAll: selectAllWizardsRaw,
  selectEntities: selectWizardEntities,
  selectIds: selectWizardIds,
  selectTotal: selectWizardTotal,
} = wizardAdapter.getSelectors();