import { ChildEntity, Column, OneToMany } from "typeorm";
import { User, UserRole } from "./user.entity.js";
import { Quest } from "./quest.entity.js";
 
@ChildEntity(UserRole.TOWER)
export class Tower extends User {

  @Column({ type: "nvarchar", length: 255 })
  name: string;
  @Column({ type: "nvarchar", length: 50, default: "ADMIN" })
  rank: string;

  @OneToMany(() => Quest, (quest) => quest.createdByTower)
  createdQuests: Quest[];
}