import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wizard } from '../../entities/wizard.entity.js';
import { IsNull, Repository } from 'typeorm';
import { UpdateWizardProfileDto } from '../../dto/update.wizard.profile.dto.js';
@Injectable()

export class WizardsService {
  constructor(@InjectRepository(Wizard) private readonly wizardRepo: Repository<Wizard>) {}
 
  /** All wizards. */
  findAll(): Promise<Wizard[]> {
    return this.wizardRepo.find();
  }
 
  async findOne(id: string): Promise<Wizard> {
    const wizard = await this.wizardRepo.findOne({ where: { id } });
    if (!wizard) {
      throw new NotFoundException(`Wizard ${id} not found`);
    }
    return wizard;
  }
 
  /** Edits a wizard's profile fields (name, affinity, picture, level, xp). */
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
 
  /** Wizards currently not on any quest — available to be assigned one. */
  findWizardsWithNoActiveQuest(): Promise<Wizard[]> {
    return this.wizardRepo.find({ where: { activeQuest: IsNull() } });
  }
}