import { Tower } from "./tower";
import { Wizard } from "./wizard";

export type QuestLevel = "EASY" | "MEDIUM" | "HARD" | "DEADLY";
export type QuestStatus = "OPEN"| "COMPLETED" | "IN_PROGRESS"

export interface Quest {
  id: number;
  title: string;
  level: QuestLevel;
  patron: string;
  description: string;
  reward: number;
  completedByWizards: Wizard[]; 
  activeWizards: Wizard[]; 
  createdByTower: Tower | null; 
  status: QuestStatus;
  open: boolean;
}
