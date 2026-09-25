import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quest, QuestStatus } from "../../entities/quest.entity.js";
import { Wizard } from "../../entities/wizard.entity.js";
import { Tower } from "../../entities/tower.entity.js";
import { CreateQuestDto } from "../../dto/crete.quest.dto.js";
import { UpdateQuestDto } from "../../dto/update.quest.dto.js";


@Injectable()
export class QuestsService {
  constructor(
    @InjectRepository(Quest) private readonly questRepo: Repository<Quest>,
    @InjectRepository(Wizard) private readonly wizardRepo: Repository<Wizard>,
    @InjectRepository(Tower) private readonly towerRepo: Repository<Tower>
  ) {}
 
  // ---- basic CRUD ("getters and setters") ----
 
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
    return this.questRepo.find();
  }
 
  async findOne(id: number): Promise<Quest> {
    const quest = await this.questRepo.findOne({
      where: { id },
      relations: { createdByTower: true },
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
 
  // ---- status-filtered lookups ----
 
  findByStatus(status: QuestStatus): Promise<Quest[]> {
    return this.questRepo.find({ where: { status } });
  }
 
  /** Quests not yet started (aka "open" / "not started"). */
  findOpenQuests(): Promise<Quest[]> {
    return this.findByStatus("OPEN");
  }
 
  /** Quests currently being worked on by one or more wizards. */
  findInProgressQuests(): Promise<Quest[]> {
    return this.findByStatus("IN_PROGRESS");
  }
 
  /** Quests that have been finished. */
  findCompletedQuests(): Promise<Quest[]> {
    return this.findByStatus("COMPLETED");
  }
 
  // ---- relation-based lookups ----
 
  /** All quests a given wizard has completed. */
  async getCompletedQuestsForWizard(wizardId: string): Promise<Quest[]> {
    const wizard = await this.wizardRepo.findOne({
      where: { id: wizardId },
      relations: { completedQuests: true },
    });
    if (!wizard) {
      throw new NotFoundException(`Wizard ${wizardId} not found`);
    }
    return wizard.completedQuests;
  }
 
  /** All quests created by a given tower (admin). */
  async getQuestsCreatedByTower(towerId: string): Promise<Quest[]> {
    const tower = await this.towerRepo.findOne({ where: { id: towerId } });
    if (!tower) {
      throw new NotFoundException(`Tower ${towerId} not found`);
    }
 
    return this.questRepo.find({
      where: { createdByTower: { id: towerId } },
    });
  }
}
 