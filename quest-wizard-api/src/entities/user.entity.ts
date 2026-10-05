import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TableInheritance,
  CreateDateColumn,
} from "typeorm";
 
export enum UserRole {
  WIZARD = "WIZARD",
  TOWER = "TOWER", 
}
 
@Entity("users")
@TableInheritance({ column: { type: "varchar", name: "role" } })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "nvarchar", length: 255, unique: true })
  email: string;

  @Column({ type: "nvarchar", length: 255, select: false }) 
  password: string; 
 
  @Column({ type: "varchar", length: 20 })
  role: UserRole;
 
  @CreateDateColumn()
  createdAt: Date;
}