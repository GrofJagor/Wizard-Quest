export class WizardActiveQuestDto{
  name: string;
  level: number;
  affinity: string;
  xp: number; // 1-100
  pictureUrl: string;
  activeQuest: number | null;
}