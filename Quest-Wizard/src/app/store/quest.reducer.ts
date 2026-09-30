import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Quest } from "../models/quest";
import *  as QuestActions from "./quest.actions";
import { createReducer, on } from "@ngrx/store";
import * as RelActions from "./quest-wizard.actions";


export interface QuestsState extends EntityState<Quest> {
  loading: boolean;
  error: string | null;
}
 
export const questAdapter = createEntityAdapter<Quest>();
 
export const initialState: QuestsState = questAdapter.getInitialState({
  loading: false,
  error: null,
});
 
export const questsReducer = createReducer(
  initialState,
 
 
  on(QuestActions.loadQuests, (state) => ({ ...state, loading: true, error: null })),
 
  on(QuestActions.loadQuestsSuccess, (state, { quests }) =>
    questAdapter.setAll(quests, { ...state, loading: false })
  ),
 
  on(QuestActions.loadQuestsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
 
 
  on(QuestActions.loadQuestById, (state) => ({ ...state, loading: true, error: null })),
 
  on(QuestActions.loadQuestByIdSuccess, (state, { quest }) =>
    questAdapter.upsertOne(quest, { ...state, loading: false })
  ),
 
  on(QuestActions.loadQuestByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
 
 
  on(QuestActions.loadQuestsByStatus, (state) => ({ ...state, loading: true, error: null })),
  on(QuestActions.loadQuestsByStatusSuccess, (state, { quests }) =>
    questAdapter.upsertMany(quests, { ...state, loading: false })
  ),
  on(QuestActions.loadQuestsByStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
 
  on(QuestActions.loadCompletedQuestsForWizard, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(QuestActions.loadCompletedQuestsForWizardSuccess, (state, { quests }) =>
    questAdapter.upsertMany(quests, { ...state, loading: false })
  ),
  on(QuestActions.loadCompletedQuestsForWizardFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
 
  on(QuestActions.loadQuestsCreatedByTower, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(QuestActions.loadQuestsCreatedByTowerSuccess, (state, { quests }) =>
    questAdapter.upsertMany(quests, { ...state, loading: false })
  ),
  on(QuestActions.loadQuestsCreatedByTowerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
 
 
  on(QuestActions.createQuest, (state) => ({ ...state, loading: true, error: null })),
  on(QuestActions.createQuestSuccess, (state, { quest }) =>
    questAdapter.addOne(quest, { ...state, loading: false })
  ),
  on(QuestActions.createQuestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
 
 
  on(QuestActions.updateQuest, (state) => ({ ...state, loading: true, error: null })),
  on(QuestActions.updateQuestSuccess, (state, { quest }) =>
    questAdapter.upsertOne(quest, { ...state, loading: false })
  ),
  on(QuestActions.updateQuestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
 

 
  on(QuestActions.deleteQuest, (state) => ({ ...state, loading: true, error: null })),
  on(QuestActions.deleteQuestSuccess, (state, { id }) =>
    questAdapter.removeOne(id, { ...state, loading: false })
  ),
  on(QuestActions.deleteQuestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
 

  on(RelActions.joinQuest, (state) => ({ ...state, loading: true, error: null })),
  on(RelActions.joinQuestSuccess, (state, { quest }) =>
    questAdapter.upsertOne(quest, { ...state, loading: false })
  ),
  on(RelActions.joinQuestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
 

 
  on(RelActions.assignActiveQuest, (state, { questId, wizard }) => {
    const quest = state.entities[questId];
    if (!quest) return state;
 
    const alreadyActive = quest.activeWizards.some((w) => w.id === wizard.id);
 
    return questAdapter.updateOne(
      {
        id: questId,
        changes: {
          activeWizards: alreadyActive ? quest.activeWizards : [...quest.activeWizards, wizard],
        },
      },
      state
    );
  }),
 
  on(RelActions.completeQuest, (state, { questId, wizard }) => {
    const quest = state.entities[questId];
    if (!quest) return state;
 
    const alreadyCompleted = quest.completedByWizards.some((w) => w.id === wizard.id);
 
    return questAdapter.updateOne(
      {
        id: questId,
        changes: {
          activeWizards: quest.activeWizards.filter((w) => w.id !== wizard.id),
          completedByWizards: alreadyCompleted
            ? quest.completedByWizards
            : [...quest.completedByWizards, wizard],
        },
      },
      state
    );
  }),
 
  on(RelActions.abandonActiveQuest, (state, { questId, wizard }) => {
    const quest = state.entities[questId];
    if (!quest) return state;
 
    return questAdapter.updateOne(
      {
        id: questId,
        changes: {
          activeWizards: quest.activeWizards.filter((w) => w.id !== wizard.id),
        },
      },
      state
    );
  })
);
 
export const {
  selectAll: selectAllQuestsRaw,
  selectEntities: selectQuestEntities,
  selectIds: selectQuestIds,
  selectTotal: selectQuestTotal,
} = questAdapter.getSelectors();
 
