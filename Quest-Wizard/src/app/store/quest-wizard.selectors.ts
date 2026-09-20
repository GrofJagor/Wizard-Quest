import { createSelector } from "@ngrx/store";
import { selectQuestsEntities } from "./quest.selectors";
import { selectWizardsEntities, selectWizardById } from "./wizard.selectors";
import { selectQuestById } from "./quest.selectors";

import { Quest } from "../models/quest";
import { Wizard } from "../models/wizard";

export interface WizardView extends Omit<Wizard, "completedQuestIds" | "activeQuestId"> {
  completedQuests: Quest[];
  activeQuest: Quest | null;
}

export interface QuestView extends Omit<Quest, "completedByWizardIds" | "activeWizardIds"> {
  completedByWizards: Wizard[];
  activeWizards: Wizard[];
}

/** Joins a single wizard with its full completed-quest and active-quest objects. */
export const selectWizardView = (wizardId: string) =>
  createSelector(
    selectWizardById(wizardId),
    selectQuestsEntities,
    (wizard, quests): WizardView | null => {
      if (!wizard) return null;
      const { completedQuestIds, activeQuestId, ...rest } = wizard;
      return {
        ...rest,
        completedQuests: completedQuestIds
          .map((id) => quests[id])
          .filter((q): q is Quest => !!q),
        activeQuest: activeQuestId ? quests[activeQuestId] ?? null : null,
      };
    }
  );

/** Joins every wizard with its full quest objects — use sparingly, prefer selectWizardView for one profile page. */
export const selectAllWizardViews = createSelector(
  selectWizardsEntities,
  selectQuestsEntities,
  (wizards, quests): WizardView[] =>
    Object.values(wizards)
      .filter((w): w is Wizard => !!w)
      .map((wizard) => {
        const { completedQuestIds, activeQuestId, ...rest } = wizard;
        return {
          ...rest,
          completedQuests: completedQuestIds
            .map((id) => quests[id])
            .filter((q): q is Quest => !!q),
          activeQuest: activeQuestId ? quests[activeQuestId] ?? null : null,
        };
      })
);

/** Joins a single quest with the full wizard objects on both sides of the relationship. */
export const selectQuestView = (questId: number) =>
  createSelector(
    selectQuestById(questId),
    selectWizardsEntities,
    (quest, wizards): QuestView | null => {
      if (!quest) return null;
      const { completedByWizardIds, activeWizardIds, ...rest } = quest;
      return {
        ...rest,
        completedByWizards: completedByWizardIds
          .map((id) => wizards[id])
          .filter((w): w is Wizard => !!w),
        activeWizards: activeWizardIds
          .map((id) => wizards[id])
          .filter((w): w is Wizard => !!w),
      };
    }
  );