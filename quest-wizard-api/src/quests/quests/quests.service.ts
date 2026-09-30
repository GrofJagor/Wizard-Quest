import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsRelations, Repository } from "typeorm";
import { Quest, QuestStatus } from "../../entities/quest.entity.js";
import { Wizard } from "../../entities/wizard.entity.js";
import { Tower } from "../../entities/tower.entity.js";
import { CreateQuestDto } from "../../dto/crete.quest.dto.js";
import { UpdateQuestDto } from "../../dto/update.quest.dto.js";


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

 
  async create(dto: CreateQuestDto): Promise<Quest> {
    let createdByTower: Tower | null = null;
 
    if (dto.createdByTowerId) {
      createdByTower = await this.towerRepo.findOne({ where: { id: dto.createdByTowerId } });
      if (!createdByTower) {
        throw new NotFoundException(`Tower ${dto.createdByTowerId} not found`);
      }
    }
 
    const quest = this.questRepo.create({
      title: dto.title,
      level: dto.level,
      patron: dto.patron,
      description: dto.description,
      reward: dto.reward,
      open: dto.open ?? true,
      status: "OPEN",
      createdByTower,
    });
 
    return this.questRepo.save(quest);
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
 
  async update(id: number, dto: UpdateQuestDto): Promise<Quest> {
    const quest = await this.findOne(id);
 
    if (dto.createdByTowerId !== undefined) {
      const createdByTower = await this.towerRepo.findOne({
        where: { id: dto.createdByTowerId },
      });
      if (!createdByTower) {
        throw new NotFoundException(`Tower ${dto.createdByTowerId} not found`);
      }
      quest.createdByTower = createdByTower;
    }
 
    Object.assign(quest, {
      title: dto.title ?? quest.title,
      level: dto.level ?? quest.level,
      patron: dto.patron ?? quest.patron,
      description: dto.description ?? quest.description,
      reward: dto.reward ?? quest.reward,
      status: dto.status ?? quest.status,
      open: dto.open ?? quest.open,
    });
 
    return this.questRepo.save(quest);
  }
 
  async remove(id: number): Promise<void> {
    const result = await this.questRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Quest ${id} not found`);
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
 
    const wizard = await this.wizardRepo.findOne({ where: { id: wizardId } });
    if (!wizard) {
      throw new NotFoundException(`Wizard ${wizardId} not found`);
    }
 
    wizard.activeQuest = quest;
    await this.wizardRepo.save(wizard);
 

    if (quest.status === "OPEN") {
      quest.status = "IN_PROGRESS";
      await this.questRepo.save(quest);
    }
 
    return this.findOne(questId);
  }
}