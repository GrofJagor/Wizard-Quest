import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Tower } from "../models/tower";
import { createReducer, on } from "@ngrx/store";
import * as TowerActions from "./tower.actions";

export interface TowersState extends EntityState<Tower> {
  loading: boolean;
  error: string | null;
}
 
export const towerAdapter = createEntityAdapter<Tower>();
 
export const initialState: TowersState = towerAdapter.getInitialState({
  loading: false,
  error: null,
});
 
export const towersReducer = createReducer(
  initialState,
 
  on(TowerActions.loadTowers, (state) => ({ ...state, loading: true, error: null })),
  on(TowerActions.loadTowersSuccess, (state, { towers }) =>
    towerAdapter.setAll(towers, { ...state, loading: false })
  ),
  on(TowerActions.loadTowersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
 
  on(TowerActions.loadTowerById, (state) => ({ ...state, loading: true, error: null })),
  on(TowerActions.loadTowerByIdSuccess, (state, { tower }) =>
    towerAdapter.upsertOne(tower, { ...state, loading: false })
  ),
  on(TowerActions.loadTowerByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
 
  on(TowerActions.updateTowerProfile, (state) => ({ ...state, loading: true, error: null })),
  on(TowerActions.updateTowerProfileSuccess, (state, { tower }) =>
    towerAdapter.upsertOne(tower, { ...state, loading: false })
  ),
  on(TowerActions.updateTowerProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
 
export const {
  selectAll: selectAllTowersRaw,
  selectEntities: selectTowerEntities,
  selectIds: selectTowerIds,
  selectTotal: selectTowerTotal,
} = towerAdapter.getSelectors();
