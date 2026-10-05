import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import * as WizardActions from "./wizard.actions";
import * as QuestActions from "./quest.actions";
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
 
 
  on(QuestActions.joinQuestSuccess, (state, { quest, wizardId }) =>
    wizardAdapter.updateOne({ id: wizardId, changes: { activeQuestId: quest.id } }, state)
  ),
 
  on(QuestActions.leaveQuestSuccess, (state, { wizardId }) =>
    wizardAdapter.updateOne({ id: wizardId, changes: { activeQuestId: null } }, state)
  ),
 
  on(QuestActions.concludeQuestSuccess, (state, { quest }) => {
  if (!quest.completedByWizards || quest.completedByWizards.length === 0) {
    return state;
  }

  const updates = quest.completedByWizards
    .filter(wizard => {
      const existing = state.entities[wizard.id];
      return !!existing; 
    })
    .map(wizard => ({
      id: wizard.id,
      changes: {
        activeQuestId: null,      
        xp: wizard.xp,            
        level: wizard.level       
      }
    }));

  return wizardAdapter.updateMany(updates, state);
})
);
 
export const {
  selectAll: selectAllWizardsRaw,
  selectEntities: selectWizardEntities,
  selectIds: selectWizardIds,
  selectTotal: selectWizardTotal,
} = wizardAdapter.getSelectors();