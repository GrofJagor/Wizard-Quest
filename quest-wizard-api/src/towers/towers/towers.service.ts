import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tower } from '../../entities/tower.entity.js';
import { Repository } from 'typeorm';
import { UpdateTowerProfileDto } from  '../../dto/update.tower.profile.dto.js';

@Injectable()
export class TowersService {
  constructor(@InjectRepository(Tower) private readonly towerRepo: Repository<Tower>) {}
 
  findAll(): Promise<Tower[]> {
    return this.towerRepo.find();
  }
 
  async findOne(id: string): Promise<Tower> {
    const tower = await this.towerRepo.findOne({ where: { id } });
    if (!tower) {
      throw new NotFoundException(`Tower ${id} not found`);
    }
    return tower;
  }
 
  async updateProfile(id: string, dto: UpdateTowerProfileDto): Promise<Tower> {
    const tower = await this.findOne(id);
 
    Object.assign(tower, {
      name: dto.name ?? tower.name,
      rank: dto.rank ?? tower.rank,
    });
 
    return this.towerRepo.save(tower);
  }
}
 
