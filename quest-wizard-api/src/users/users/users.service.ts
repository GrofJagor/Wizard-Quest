import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, UserRole } from "../../entities/user.entity.js";
import { Wizard } from "../../entities/wizard.entity.js";
import { Tower } from "../../entities/tower.entity.js";


interface CreateWizardInput {
  email: string;
  passwordHash: string;
  name: string;
  affinity: string;
}
 
interface CreateTowerInput {
  email: string;
  passwordHash: string;
}
 
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Wizard) private readonly wizardRepo: Repository<Wizard>,
    @InjectRepository(Tower) private readonly towerRepo: Repository<Tower>
  ) {}
 
  /** Looks up a user regardless of role. Includes password (needed for login check). */
  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder("user")
      .addSelect("user.password") // password column has select: false by default
      .where("user.email = :email", { email })
      .getOne();
  }
 
  findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }
 
  createWizard(input: CreateWizardInput): Promise<Wizard> {
    const wizard = this.wizardRepo.create({
      email: input.email,
      password: input.passwordHash,
      role: UserRole.WIZARD,
      name: input.name,
      affinity: input.affinity,
      level: 1,
      xp: 1,
      completedQuests: [],
      activeQuest: null,
    });
    return this.wizardRepo.save(wizard);
  }
 
  createTower(input: CreateTowerInput): Promise<Tower> {
    const tower = this.towerRepo.create({
      email: input.email,
      password: input.passwordHash,
      role: UserRole.TOWER,
      rank: "ADMIN",
    });
    return this.towerRepo.save(tower);
  }
 
  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }
}