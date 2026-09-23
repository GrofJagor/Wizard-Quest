import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TableInheritance,
  CreateDateColumn,
} from "typeorm";
 
export enum UserRole {
  WIZARD = "WIZARD",
  TOWER = "TOWER", // admin
}
 
/**
 * Base user table. Wizard and Tower are stored in the SAME sql table
 * (Single Table Inheritance) discriminated by the `role` column.
 * TypeORM automatically instantiates the correct subclass when you
 * query the base `User` repository.
 */
@Entity("users")
@TableInheritance({ column: { type: "varchar", name: "role" } })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;
 
  // DODAT TIP: 'nvarchar' (standard za MS SQL tekstualna polja) i dužina
  @Column({ type: "nvarchar", length: 255, unique: true })
  email: string;
 
  // DODAT TIP: 'nvarchar' i dužina za bcrypt hash
  @Column({ type: "nvarchar", length: 255, select: false }) // never returned by default queries
  password: string; // bcrypt hash
 
  @Column({ type: "varchar", length: 20 })
  role: UserRole;
 
  @CreateDateColumn()
  createdAt: Date;
}