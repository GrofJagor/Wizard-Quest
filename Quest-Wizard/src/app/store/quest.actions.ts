import { createAction, props } from "@ngrx/store";
import { Quest, QuestStatus } from "../models/quest";
import { CreateQuestPayload, UpdateQuestPayload } from "../services/quest";


export const loadQuests = createAction("[Quests] Load Quests");
 
export const loadQuestsSuccess = createAction(
  "[Quests] Load Quests Success",
  props<{ quests: Quest[] }>()
);
 
export const loadQuestsFailure = createAction(
  "[Quests] Load Quests Failure",
  props<{ error: string }>()
);
 
// ---- load one ----
 
export const loadQuestById = createAction(
  "[Quests] Load Quest By Id",
  props<{ id: number }>()
);
 
export const loadQuestByIdSuccess = createAction(
  "[Quests] Load Quest By Id Success",
  props<{ quest: Quest }>()
);
 
export const loadQuestByIdFailure = createAction(
  "[Quests] Load Quest By Id Failure",
  props<{ error: string }>()
);
 
// ---- load by status (open / in-progress / completed) ----
 
export const loadQuestsByStatus = createAction(
  "[Quests] Load Quests By Status",
  props<{ status: QuestStatus }>()
);
 
export const loadQuestsByStatusSuccess = createAction(
  "[Quests] Load Quests By Status Success",
  props<{ quests: Quest[] }>()
);
 
export const loadQuestsByStatusFailure = createAction(
  "[Quests] Load Quests By Status Failure",
  props<{ error: string }>()
);
 
// ---- load completed-by-wizard / created-by-tower ----
 
export const loadCompletedQuestsForWizard = createAction(
  "[Quests] Load Completed Quests For Wizard",
  props<{ wizardId: string }>()
);
 
export const loadCompletedQuestsForWizardSuccess = createAction(
  "[Quests] Load Completed Quests For Wizard Success",
  props<{ quests: Quest[] }>()
);
 
export const loadCompletedQuestsForWizardFailure = createAction(
  "[Quests] Load Completed Quests For Wizard Failure",
  props<{ error: string }>()
);
 
export const loadQuestsCreatedByTower = createAction(
  "[Quests] Load Quests Created By Tower",
  props<{ towerId: string }>()
);
 
export const loadQuestsCreatedByTowerSuccess = createAction(
  "[Quests] Load Quests Created By Tower Success",
  props<{ quests: Quest[] }>()
);
 
export const loadQuestsCreatedByTowerFailure = createAction(
  "[Quests] Load Quests Created By Tower Failure",
  props<{ error: string }>()
);
 
// ---- create ----
 
export const createQuest = createAction(
  "[Quests] Create Quest",
  props<{ payload: CreateQuestPayload }>()
);
 
export const createQuestSuccess = createAction(
  "[Quests] Create Quest Success",
  props<{ quest: Quest }>()
);
 
export const createQuestFailure = createAction(
  "[Quests] Create Quest Failure",
  props<{ error: string }>()
);
 
// ---- update ----
 
export const updateQuest = createAction(
  "[Quests] Update Quest",
  props<{ id: number; payload: UpdateQuestPayload }>()
);
 
export const updateQuestSuccess = createAction(
  "[Quests] Update Quest Success",
  props<{ quest: Quest }>()
);
 
export const updateQuestFailure = createAction(
  "[Quests] Update Quest Failure",
  props<{ error: string }>()
);
 
// ---- delete ----
 
export const deleteQuest = createAction("[Quests] Delete Quest", props<{ id: number }>());
 
export const deleteQuestSuccess = createAction(
  "[Quests] Delete Quest Success",
  props<{ id: number }>()
);
 
export const deleteQuestFailure = createAction(
  "[Quests] Delete Quest Failure",
  props<{ error: string }>()
);
 