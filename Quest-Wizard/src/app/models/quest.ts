export type QuestLevel = "EASY" | "MEDIUM" | "HARD" | "DEADLY";
export type status = "OPEN"| "NOT STARTED"| "COMPLETED" | "IN PROGRESS"

export interface Quest {
  id: number;
  title: string;
  level: QuestLevel;
  patron: string;
  description: string;
  reward: number;
  completedByWizardIds: string[]; // many-to-many
  activeWizardIds: string[]; // many-to-one from wizard's side (many wizards can be active on one quest)
  status: status;
  open: boolean;
}
