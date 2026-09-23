import { ChildEntity, Column, OneToMany } from "typeorm";
import { User, UserRole } from "./user.entity.js";
import { Quest } from "./quest.entity.js";
 
/** Tower = admin account. Minimal extra fields, extend as needed. */
@ChildEntity(UserRole.TOWER)
export class Tower extends User {
  // DODAT TIP: 'nvarchar' i dužina, uz zadržavanje podrazumevane vrednosti
  @Column({ type: "nvarchar", length: 50, default: "ADMIN" })
  rank: string;

  @OneToMany(() => Quest, (quest) => quest.createdByTower)
  createdQuests: Quest[];
}