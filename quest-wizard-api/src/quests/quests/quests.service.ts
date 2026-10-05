import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsRelations, In, Repository } from "typeorm";
import { Quest, QuestStatus } from "../../entities/quest.entity.js";
import { Wizard } from "../../entities/wizard.entity.js";
import { Tower } from "../../entities/tower.entity.js";
import { CreateQuestDto } from "../../dto/crete.quest.dto.js";
import { UpdateQuestDto } from "../../dto/update.quest.dto.js";

const QUEST_XP_REWARDS: Record<string, number> = {
  EASY: 5,
  MEDIUM: 13,
  HARD: 36,
  DEADLY: 89,
};

const QUEST_RELATIONS: FindOptionsRelations<Quest> = {
  completedByWizards: true,
  activeWizards: true,
  createdByTower: true,
};
 
@Injectable()
export class QuestsService {
  constructor(
    @InjectRepository(Quest) private readonly questRepo: Repository<Quest>,
    @InjectRepository(Wizard) private readonly wizardRepo: Repository<Wizard>,
    @InjectRepository(Tower) private readonly towerRepo: Repository<Tower>
  ) {}
 

  async create(dto: CreateQuestDto, createdByTowerId: string): Promise<Quest> {
    const createdByTower = await this.towerRepo.findOne({ where: { id: createdByTowerId } });
    if (!createdByTower) {
      throw new NotFoundException(`Tower ${createdByTowerId} not found`);
    }
 
    const isOpen = dto.open ?? true;
 
    let assignedWizards: Wizard[] = [];
    if (!isOpen) {
      if (!dto.assignedWizardIds || dto.assignedWizardIds.length === 0) {
        throw new BadRequestException(
          "At least one wizard must be assigned when creating a non-open quest."
        );
      }
 
      assignedWizards = await this.wizardRepo.find({
        where: { id: In(dto.assignedWizardIds) },
        relations: { activeQuest: true },
      });
 
      if (assignedWizards.length !== dto.assignedWizardIds.length) {
        throw new NotFoundException("One or more assigned wizards were not found.");
      }
 
      const alreadyCommitted = assignedWizards.find(
        (w) => w.activeQuest && w.activeQuest.status === "IN_PROGRESS"
      );
      if (alreadyCommitted) {
        throw new BadRequestException(
          `${alreadyCommitted.name} is already committed to an in-progress quest.`
        );
      }
    }
 
    const quest = this.questRepo.create({
      title: dto.title,
      level: dto.level,
      patron: dto.patron,
      description: dto.description,
      reward: dto.reward,
      open: isOpen,
      status: isOpen ? "OPEN" : "IN_PROGRESS",
      createdByTower,
    });
 
    const saved = await this.questRepo.save(quest);
 
    if (!isOpen) {
      for (const wizard of assignedWizards) {
        wizard.activeQuest = saved;
      }
      await this.wizardRepo.save(assignedWizards);
    }
 
    return this.findOne(saved.id);
  }
 
 
  findAll(): Promise<Quest[]> {
    return this.questRepo.find({ relations: QUEST_RELATIONS });
  }
 
  async findOne(id: number): Promise<Quest> {
    const quest = await this.questRepo.findOne({
      where: { id },
      relations: QUEST_RELATIONS,
    });
    if (!quest) {
      throw new NotFoundException(`Quest ${id} not found`);
    }
    return quest;
  }
 
  async update(id: number, dto: UpdateQuestDto, requestingTowerId: string): Promise<Quest> {
    const quest = await this.findOne(id);
    this.assertOwnership(quest, requestingTowerId, "edit");
 
    Object.assign(quest, {
      title: dto.title ?? quest.title,
      level: dto.level ?? quest.level,
      patron: dto.patron ?? quest.patron,
      description: dto.description ?? quest.description,
      reward: dto.reward ?? quest.reward,
      open: dto.open ?? quest.open,
    });
 
    await this.questRepo.save(quest);
    return this.findOne(id);
  }
 
  async remove(id: number, requestingTowerId: string): Promise<void> {
    const quest = await this.findOne(id);
    this.assertOwnership(quest, requestingTowerId, "delete");
 
    await this.questRepo.delete(id);
  }
 
  private assertOwnership(quest: Quest, requestingTowerId: string, action: string): void {
    if (quest.createdByTower?.id !== requestingTowerId) {
      throw new ForbiddenException(`You can only ${action} quests you created.`);
    }
  }
 
 
  findByStatus(status: QuestStatus): Promise<Quest[]> {
    return this.questRepo.find({ where: { status }, relations: QUEST_RELATIONS });
  }

  findOpenQuests(): Promise<Quest[]> {
    return this.findByStatus("OPEN");
  }

  findInProgressQuests(): Promise<Quest[]> {
    return this.findByStatus("IN_PROGRESS");
  }

  findCompletedQuests(): Promise<Quest[]> {
    return this.findByStatus("COMPLETED");
  }

  async getCompletedQuestsForWizard(wizardId: string): Promise<Quest[]> {
    const wizardExists = await this.wizardRepo.exists({ where: { id: wizardId } });
    if (!wizardExists) {
      throw new NotFoundException(`Wizard ${wizardId} not found`);
    }
 
    return this.questRepo.find({
      where: { completedByWizards: { id: wizardId } },
      relations: QUEST_RELATIONS,
    });
  }

  async getQuestsCreatedByTower(towerId: string): Promise<Quest[]> {
    const tower = await this.towerRepo.findOne({ where: { id: towerId } });
    if (!tower) {
      throw new NotFoundException(`Tower ${towerId} not found`);
    }
 
    return this.questRepo.find({
      where: { createdByTower: { id: towerId } },
      relations: QUEST_RELATIONS,
    });
  }

  async joinWizardToQuest(questId: number, wizardId: string): Promise<Quest> {
    const quest = await this.questRepo.findOne({ where: { id: questId } });
    if (!quest) {
      throw new NotFoundException(`Quest ${questId} not found`);
    }
    if (quest.status !== "OPEN") {
      throw new BadRequestException("You can only join a quest that is still open.");
    }
 
    const wizard = await this.wizardRepo.findOne({ 
      where: { id: wizardId },
      relations: {
        activeQuest: true
      }
    });
    if (!wizard) {
      throw new NotFoundException(`Wizard ${wizardId} not found`);
    }
    if (wizard.activeQuest?.status==="IN_PROGRESS"){
      throw new BadRequestException("You can not join another quest until you complete your current quest")
    }
 
    wizard.activeQuest = quest;
    await this.wizardRepo.save(wizard);
 
    return this.findOne(questId);
  }

  async leaveWizardFromQuest(questId: number, wizardId: string): Promise<Quest> {
    const quest = await this.questRepo.findOne({ where: { id: questId } });
    if (!quest) {
      throw new NotFoundException(`Quest ${questId} not found`);
    }
 
    const wizard = await this.wizardRepo.findOne({
      where: { id: wizardId },
      relations: { activeQuest: true },
    });
    if (!wizard) {
      throw new NotFoundException(`Wizard ${wizardId} not found`);
    }
    if (!wizard.activeQuest || wizard.activeQuest.id !== questId) {
      throw new BadRequestException("You are not currently on this quest.");
    }
    if (quest.status !== "OPEN") {
      throw new BadRequestException("You can only leave a quest before it has started.");
    }
 
    wizard.activeQuest = null;
    await this.wizardRepo.save(wizard);
 
    return this.findOne(questId);
  }
 
  async startQuest(questId: number, requestingTowerId: string): Promise<Quest> {
    const quest = await this.findOne(questId);
    this.assertOwnership(quest, requestingTowerId, "start");
 
    if (quest.status !== "OPEN") {
      throw new BadRequestException("Only an open quest can be started.");
    }
    if (quest.activeWizards.length === 0) {
      throw new BadRequestException("At least one wizard must join before the quest can start.");
    }
 
    quest.status = "IN_PROGRESS";
    await this.questRepo.save(quest);
    return this.findOne(questId);
  }


async concludeQuest(questId: number, requestingTowerId: string): Promise<Quest> {
  const quest = await this.questRepo.findOne({
    where: { id: questId },
    relations: { activeWizards: true, createdByTower: true },
  });
  
  if (!quest) {
    throw new NotFoundException(`Quest ${questId} not found`);
  }
  
  this.assertOwnership(quest, requestingTowerId, "conclude");

  if (quest.status !== "IN_PROGRESS") {
    throw new BadRequestException("Only an in-progress quest can be concluded.");
  }

  const xpReward = QUEST_XP_REWARDS[quest.level.toUpperCase()] || 0;
  const MAX_XP_PER_LEVEL = 100;

  for (const wizard of quest.activeWizards) {
    await this.wizardRepo
      .createQueryBuilder()
      .relation(Wizard, "completedQuests")
      .of(wizard.id)
      .add(questId);

    let newXp = wizard.xp + xpReward;
    let newLevel = wizard.level;

    while (newXp >= MAX_XP_PER_LEVEL) {
      newXp -= MAX_XP_PER_LEVEL;
      newLevel++;
    }

    wizard.xp = newXp;
    wizard.level = newLevel;
    wizard.activeQuest = null;
  }

  if (quest.activeWizards.length > 0) {
    await this.wizardRepo.save(quest.activeWizards);
  }

  quest.status = "COMPLETED";
  quest.activeWizards = [];
  await this.questRepo.save(quest);

  return this.findOne(questId);
}

}