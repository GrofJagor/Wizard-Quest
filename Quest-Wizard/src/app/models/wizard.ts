
export interface Wizard {
  id: string;
  name: string;
  level: number;
  affinity: string;
  xp: number; 
  completedQuestIds: number[]; 
  activeQuestId: number | null; 
  pictureUrl: string;
}
 