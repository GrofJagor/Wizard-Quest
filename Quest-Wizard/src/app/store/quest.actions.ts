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
 
export const loadQuestById = createAction("[Quests] Load Quest By Id", props<{ id: number }>());
export const loadQuestByIdSuccess = createAction(
  "[Quests] Load Quest By Id Success",
  props<{ quest: Quest }>()
);
export const loadQuestByIdFailure = createAction(
  "[Quests] Load Quest By Id Failure",
  props<{ error: string }>()
);

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
 
export const deleteQuest = createAction("[Quests] Delete Quest", props<{ id: number }>());
export const deleteQuestSuccess = createAction(
  "[Quests] Delete Quest Success",
  props<{ id: number }>()
);
export const deleteQuestFailure = createAction(
  "[Quests] Delete Quest Failure",
  props<{ error: string }>()
);
 
export const joinQuest = createAction(
  "[Quests] Join Quest",
  props<{ questId: number; wizardId: string }>()
);
export const joinQuestSuccess = createAction(
  "[Quests] Join Quest Success",
  props<{ quest: Quest; wizardId: string }>()
);
export const joinQuestFailure = createAction(
  "[Quests] Join Quest Failure",
  props<{ error: string }>()
);
 
export const leaveQuest = createAction(
  "[Quests] Leave Quest",
  props<{ questId: number; wizardId: string }>()
);
export const leaveQuestSuccess = createAction(
  "[Quests] Leave Quest Success",
  props<{ quest: Quest; wizardId: string }>()
);
export const leaveQuestFailure = createAction(
  "[Quests] Leave Quest Failure",
  props<{ error: string }>()
);
 
export const startQuest = createAction("[Quests] Start Quest", props<{ questId: number }>());
export const startQuestSuccess = createAction(
  "[Quests] Start Quest Success",
  props<{ quest: Quest }>()
);
export const startQuestFailure = createAction(
  "[Quests] Start Quest Failure",
  props<{ error: string }>()
);
 
export const concludeQuest = createAction("[Quests] Conclude Quest", props<{ questId: number }>());
export const concludeQuestSuccess = createAction(
  "[Quests] Conclude Quest Success",
  props<{ quest: Quest }>()
);
export const concludeQuestFailure = createAction(
  "[Quests] Conclude Quest Failure",
  props<{ error: string }>()
);
 