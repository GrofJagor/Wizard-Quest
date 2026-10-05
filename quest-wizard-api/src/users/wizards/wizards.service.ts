import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wizard } from '../../entities/wizard.entity.js';
import { IsNull, Repository } from 'typeorm';
import { UpdateWizardProfileDto } from '../../dto/update.wizard.profile.dto.js';

@Injectable()
export class WizardsService {
  constructor(@InjectRepository(Wizard) private readonly wizardRepo: Repository<Wizard>) {}
  findAll(): Promise<Wizard[]> {
    return this.wizardRepo.find({ relations: { activeQuest: true, completedQuests: true } });
  }
 
  async findOne(id: string): Promise<Wizard> {
    const wizard = await this.wizardRepo.findOne({
      where: { id },
      relations: {
        activeQuest: { createdByTower: true, activeWizards: true },
        completedQuests: true,
      },
    });
    if (!wizard) {
      throw new NotFoundException(`Wizard ${id} not found`);
    }
    return wizard;
  }

  async updateProfile(id: string, dto: UpdateWizardProfileDto): Promise<Wizard> {
    const wizard = await this.findOne(id);
 
    Object.assign(wizard, {
      name: dto.name ?? wizard.name,
      affinity: dto.affinity ?? wizard.affinity,
      pictureUrl: dto.pictureUrl ?? wizard.pictureUrl,
      level: dto.level ?? wizard.level,
      xp: dto.xp ?? wizard.xp,
    });
 
    return this.wizardRepo.save(wizard);
  }

  async remove(id: string): Promise<void> {
    const result = await this.wizardRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Wizard ${id} not found`);
    }
  }
  
  findWizardsWithNoActiveQuest(): Promise<Wizard[]> {
    return this.wizardRepo.find({
      where: { activeQuest: IsNull() },
      relations: { completedQuests: true },
    });
  }

  findAvailableForAssignment(): Promise<Wizard[]> {
    return this.wizardRepo
      .createQueryBuilder("wizard")
      .leftJoinAndSelect("wizard.activeQuest", "activeQuest")
      .where("activeQuest.id IS NULL")
      .getMany();
  }

}