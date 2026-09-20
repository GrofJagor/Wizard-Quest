import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Quest } from "../models/quest";
import *  as QuestActions from "./quest.actions";
import { createReducer, on } from "@ngrx/store";
import * as RelActions from "./quest-wizard.actions";

// export interface QuestsState extends EntityState<Quest>{
//     selectedQuestId:number,
// }

// const adapter=createEntityAdapter<Quest>();

// export const initialState: QuestsState=adapter.getInitialState({
//     selectedQuestId:0,
// })

// export const questsReducer = createReducer(
//   initialState,
//   on(Actions.loadQuests, (state) => ({
//     ...state,
//   })),

//   on(Actions.loadQuestsSuccess, (state, { quests }) =>
//     adapter.setAll(quests, { ...state, loading: false })
//   ),

//   on(Actions.loadQuestsFailure, (state) => ({
//     ...state,
//   }))
// );

// export const { selectAll, selectEntities, selectIds, selectTotal } =
//   adapter.getSelectors();

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
 
  on(QuestActions.loadQuests, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
 
  on(QuestActions.loadQuestsSuccess, (state, { quests }) =>
    questAdapter.setAll(quests, { ...state, loading: false })
  ),
 
  on(QuestActions.loadQuestsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
 
  // --- shared relationship actions ---
 
  on(RelActions.assignActiveQuest, (state, { questId, wizardId }) => {
    const quest = state.entities[questId];
    if (!quest) return state;
 
    return questAdapter.updateOne(
      {
        id: questId,
        changes: {
          activeWizardIds: quest.activeWizardIds.includes(wizardId)
            ? quest.activeWizardIds
            : [...quest.activeWizardIds, wizardId],
        },
      },
      state
    );
  }),
 
  on(RelActions.completeQuest, (state, { questId, wizardId }) => {
    const quest = state.entities[questId];
    if (!quest) return state;
 
    return questAdapter.updateOne(
      {
        id: questId,
        changes: {
          activeWizardIds: quest.activeWizardIds.filter((id) => id !== wizardId),
          completedByWizardIds: quest.completedByWizardIds.includes(wizardId)
            ? quest.completedByWizardIds
            : [...quest.completedByWizardIds, wizardId],
        },
      },
      state
    );
  }),
 
  on(RelActions.abandonActiveQuest, (state, { questId, wizardId }) => {
    const quest = state.entities[questId];
    if (!quest) return state;
 
    return questAdapter.updateOne(
      {
        id: questId,
        changes: {
          activeWizardIds: quest.activeWizardIds.filter((id) => id !== wizardId),
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