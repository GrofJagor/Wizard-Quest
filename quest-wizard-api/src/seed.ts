import 'reflect-metadata'; // OVA LINIJA MORA BITI SKROZ NA VRHU!
import { DataSource } from 'typeorm';
import { NestFactory } from "@nestjs/core";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { AppModule } from "./app.module.js";
import { User, UserRole } from "./entities/user.entity.js";
import { Wizard } from "./entities/wizard.entity.js";
import { Tower } from "./entities/tower.entity.js";
import { Quest, QuestLevel } from "./entities/quest.entity.js";

 const SEED_PASSWORD = "Password123!";
 
async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
 
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  const wizardRepo = app.get<Repository<Wizard>>(getRepositoryToken(Wizard));
  const towerRepo = app.get<Repository<Tower>>(getRepositoryToken(Tower));
  const questRepo = app.get<Repository<Quest>>(getRepositoryToken(Quest));
 
  console.log("Clearing existing data...");
  // Redosled je važan zbog stranih ključeva (Foreign Keys)
  await userRepo.query("DELETE FROM wizard_completed_quests");
  await userRepo.query("UPDATE users SET activeQuestId = NULL");
  
  // POPRAVLJENO: Umesto .delete({}) koristimo sirovi SQL DELETE da TypeORM ne baci grešku
  await userRepo.query("DELETE FROM users");
  await questRepo.query("DELETE FROM quests");
 
  console.log("Seeding quests...");
  const [wyrmroot, grimoire, escort, hollowKing] = await questRepo.save([
    questRepo.create({
      title: "Seal the Wyrmroot Fissure",
      level: "HARD" as QuestLevel,
      patron: "Archmage Veyra",
      description: "A rift beneath the old orchard is leaking corrupted mana.",
      reward: 500,
      status: "OPEN",
      open: true,
    }),
    questRepo.create({
      title: "Retrieve the Moonlit Grimoire",
      level: "MEDIUM" as QuestLevel,
      patron: "Librarian Oskar",
      description: "A rare grimoire was stolen from the Sunken Archive.",
      reward: 250,
      status: "COMPLETED",
      open: false,
    }),
    questRepo.create({
      title: "Escort the Alchemist to Brindlewatch",
      level: "EASY" as QuestLevel,
      patron: "Alchemist Fenn",
      description: "Safe passage needed through bandit territory.",
      reward: 120,
      status: "COMPLETED",
      open: false,
    }),
    questRepo.create({
      title: "Banish the Hollow King",
      level: "DEADLY" as QuestLevel,
      patron: "The Tower Council",
      description: "An ancient undead sovereign has awoken beneath the capital.",
      reward: 1000,
      status: "OPEN",
      open: true,
    }),
  ]);
 
  console.log("Seeding wizards...");
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
 
  const elowen = wizardRepo.create({
    email: "elowen@wizardtower.dev",
    password: passwordHash,
    role: UserRole.WIZARD,
    name: "Elowen Thornveil",
    level: 12,
    affinity: "Verdant",
    xp: 68,
    pictureUrl: "https://example.com/elowen.jpg",
    completedQuests: [grimoire, escort],
    activeQuest: wyrmroot,
  });
 
  const darius = wizardRepo.create({
    email: "darius@wizardtower.dev",
    password: passwordHash,
    role: UserRole.WIZARD,
    name: "Darius Emberfall",
    level: 7,
    affinity: "Pyric",
    xp: 34,
    pictureUrl: "https://example.com/darius.jpg",
    completedQuests: [escort],
    activeQuest: hollowKing,
  });
 
  const nym = wizardRepo.create({
    email: "nym@wizardtower.dev",
    password: passwordHash,
    role: UserRole.WIZARD,
    name: "Nym Quickshadow",
    level: 3,
    affinity: "Umbral",
    xp: 12,
    pictureUrl: "https://example.com/nym.jpg",
    completedQuests: [],
    activeQuest: null,
  });
 
  await wizardRepo.save([elowen, darius, nym]);
 
  console.log("Seeding tower (admin)...");
  const admin = towerRepo.create({
    email: "admin@wizardtower.dev",
    password: passwordHash,
    role: UserRole.TOWER,
    rank: "HIGH_ADMIN",
  });
 
  await towerRepo.save(admin);
 
  console.log("\nSeed complete.");
  console.log(`All seeded accounts use the password: ${SEED_PASSWORD}`);
  console.log("- elowen@wizardtower.dev (wizard, has an active + completed quests)");
  console.log("- darius@wizardtower.dev (wizard, has an active + completed quest)");
  console.log("- nym@wizardtower.dev    (wizard, fresh — no quests yet)");
  console.log("- admin@wizardtower.dev  (tower / admin)");
 
  await app.close();
}
 
seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});