import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Quest } from "../models/quest";
import *  as Actions from "./quest.actions";
import { createReducer, on } from "@ngrx/store";

export interface QuestsState extends EntityState<Quest>{
    selectedQuestId:number,
}

const adapter=createEntityAdapter<Quest>();

export const initialState: QuestsState=adapter.getInitialState({
    selectedQuestId:0,
})

export const questsReducer = createReducer(
  initialState,
  on(Actions.loadQuests, (state) => ({
    ...state,
  })),

  on(Actions.loadQuestsSuccess, (state, { quests }) =>
    adapter.setAll(quests, { ...state, loading: false })
  ),

  on(Actions.loadQuestsFailure, (state) => ({
    ...state,
  }))
);

export const { selectAll, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors();