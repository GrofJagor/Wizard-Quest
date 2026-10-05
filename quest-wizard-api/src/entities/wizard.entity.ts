import { ChildEntity, Column, ManyToMany, ManyToOne, JoinTable } from "typeorm";
import { User, UserRole } from "./user.entity.js";
import { Quest } from "./quest.entity.js";

@ChildEntity(UserRole.WIZARD)
export class Wizard extends User {
  @Column({ type: "nvarchar", length: 255 })
  name: string;
 
  @Column({ type: "int", default: 1 })
  level: number;
 
  @Column({ type: "nvarchar", length: 100 })
  affinity: string;
 
  @Column({ type: "int", default: 1 })
  xp: number;
 
  @Column({ type: "nvarchar", length: 500, nullable: true })
  pictureUrl: string;
 
  @Column({type: "bit", default: 0})
  isOnActiveQuest: boolean;

  @ManyToMany(() => Quest, (quest) => quest.completedByWizards)
  @JoinTable({ name: "wizard_completed_quests" })
  completedQuests: Quest[];
 
  @ManyToOne(() => Quest, (quest) => quest.activeWizards, { nullable: true })
  activeQuest: Quest | null;
}