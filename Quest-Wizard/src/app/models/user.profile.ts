export interface WizardProfileView {
  id: string;
  email: string;
  role: "WIZARD";
  name: string;
  level: number;
  affinity: string;
  xp: number;
  pictureUrl: string;
}
 
export interface TowerProfileView {
  id: string;
  email: string;
  role: "TOWER";
  name: string;
  rank: string;
}
 
export type UserProfileView = WizardProfileView | TowerProfileView;
 