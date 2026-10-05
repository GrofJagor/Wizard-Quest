import { Quest } from "./quest";

export interface Wizard {
  id: string;
  name: string;
  level: number;
  affinity: string;
  xp: number; // 1-100
  pictureUrl: string;
  completedQuestIds?: number[];
  activeQuestId?: number | null;
  activeQuest?: Quest | null;
}