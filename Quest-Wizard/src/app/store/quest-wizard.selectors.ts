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
 
export const selectWizardView = (wizardId: string) =>
  createSelector(
    selectWizardById(wizardId),
    selectQuestsEntities,
    (wizard, quests): WizardView | null => {
      if (!wizard) return null;
      const { completedQuestIds, activeQuestId, ...rest } = wizard;
 
      return {
        ...rest,
        completedQuests: (completedQuestIds ?? [])
          .map((id) => quests[id])
          .filter((q): q is Quest => !!q),
        activeQuest: activeQuestId ? (quests[activeQuestId] ?? null) : null,
      };
    }
  );
 
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
          completedQuests: (completedQuestIds ?? [])
            .map((id) => quests[id])
            .filter((q): q is Quest => !!q),
          activeQuest: activeQuestId ? (quests[activeQuestId] ?? null) : null,
        };
      })
);

export { selectQuestById };