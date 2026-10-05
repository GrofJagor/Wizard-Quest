import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Wizard } from "./wizard.entity.js";
import { Tower } from "./tower.entity.js";

export type QuestLevel = "EASY" | "MEDIUM" | "HARD" | "DEADLY";
export type QuestStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED";

@Entity("quests")
export class Quest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "nvarchar", length: 255 })
  title: string;

  @Column({ type: "varchar", length: 20 })
  level: QuestLevel;

  @Column({ type: "nvarchar", length: 255 })
  patron: string;

  // 'nvarchar' sa 'max' je odlična zamena za 'text' u MS SQL-u
  @Column({ type: "nvarchar", length: "max" })
  description: string;

  @Column({ type: "int" })
  reward: number;

  @Column({ type: "nvarchar", length: 50, default: "OPEN" })
  status: QuestStatus;

  @Column({ type: "bit", default: true })
  open: boolean;

  @ManyToMany(() => Wizard, (wizard) => wizard.completedQuests)
  completedByWizards: Wizard[];

  @OneToMany(() => Wizard, (wizard) => wizard.activeQuest)
  activeWizards: Wizard[];

  @ManyToOne(() => Tower, (tower) => tower.createdQuests, { nullable: true })
  createdByTower: Tower | null;
}