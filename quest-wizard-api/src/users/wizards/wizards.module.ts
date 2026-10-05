import { Module } from '@nestjs/common';
import { WizardsService } from './wizards.service.js';
import { WizardsController } from './wizards.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wizard } from '../../entities/wizard.entity.js';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wizard]),
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  providers: [WizardsService],
  controllers: [WizardsController],
  exports: [WizardsService],
})
export class WizardsModule {}