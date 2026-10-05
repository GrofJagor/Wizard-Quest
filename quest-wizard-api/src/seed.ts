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
  
  await userRepo.query("DELETE FROM users");
  await questRepo.query("DELETE FROM quests");
  
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
  
  console.log("Seeding tower (admin)...");
  const admin = towerRepo.create({
    id: "a1b2c3d4-e5f6-47a8-b9c0-123456789abc", // Eksplicitan validan UUID v4 za admina
    name: "Eastern Tower",
    email: "admin@wizardtower.dev",
    password: passwordHash,
    role: UserRole.TOWER,
    rank: "HIGH_ADMIN",
  });

  await towerRepo.save(admin);
 
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
      createdByTower: admin
    }),
    questRepo.create({
      title: "Retrieve the Moonlit Grimoire",
      level: "MEDIUM" as QuestLevel,
      patron: "Librarian Oskar",
      description: "A rare grimoire was stolen from the Sunken Archive.",
      reward: 250,
      status: "COMPLETED",
      open: false,
      createdByTower: admin
    }),
    questRepo.create({
      title: "Escort the Alchemist to Brindle",
      level: "EASY" as QuestLevel,
      patron: "Alchemist Fenn",
      description: "Safe passage needed through bandit territory.",
      reward: 120,
      status: "COMPLETED",
      open: false,
      createdByTower: admin
    }),
    questRepo.create({
      title: "Banish the Hollow King",
      level: "DEADLY" as QuestLevel,
      patron: "The Tower Council",
      description: "An ancient undead sovereign has awoken beneath the capital.",
      reward: 1000,
      status: "OPEN",
      open: true,
      createdByTower: admin
    }),
  ]);
  
  console.log("Seeding wizards...");
  
  const gandalf = wizardRepo.create({
    id: "0c43bf29-96ba-4111-a924-b42e99f226b5", 
    email: "Gandalf@wizardtower.dev",
    password: passwordHash,
    role: UserRole.WIZARD,
    name: "Gandalf the Gray",
    level: 12,
    affinity: "Hope",
    xp: 68,
    pictureUrl: "https://i.pinimg.com/474x/40/48/17/404817db5ec123721a0f418096f37929.jpg",
    completedQuests: [grimoire, escort],
    activeQuest: wyrmroot,
    isOnActiveQuest: true,
  });
 
  const darius = wizardRepo.create({
    id: "b2c3d4e5-f6a7-48b9-c0d1-23456789abcd",
    email: "darius@wizardtower.dev",
    password: passwordHash,
    role: UserRole.WIZARD,
    name: "Darius Emberfall",
    level: 7,
    affinity: "Pyric",
    xp: 34,
    pictureUrl: "https://images.stockcake.com/public/b/d/e/bde52b26-da70-45e2-bbae-2f696056ec8d_large/mystical-fire-wizard-stockcake.jpg",
    completedQuests: [escort],
    activeQuest: hollowKing,
    isOnActiveQuest: true,
  });
 
  const nym = wizardRepo.create({
    id: "c3d4e5f6-a7b8-49c0-d1e2-3456789abcde",
    email: "nym@wizardtower.dev",
    password: passwordHash,
    role: UserRole.WIZARD,
    name: "Nym Quickshadow",
    level: 3,
    affinity: "Umbral",
    xp: 12,
    pictureUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ea/GANDALF.jpg",
    completedQuests: [],
    activeQuest: null,
    isOnActiveQuest: false,
  });
 
  await wizardRepo.save([gandalf, darius, nym]);
  await towerRepo.save(admin);
 
  console.log("\nSeed complete.");
  console.log(`All seeded accounts use the password: ${SEED_PASSWORD}`);
  console.log("- Gandalf@wizardtower.dev ID: 0c43bf29-96ba-4111-a924-b42e99f226b5");
 
  await app.close();
}
 
seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
