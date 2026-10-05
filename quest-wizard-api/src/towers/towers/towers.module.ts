import { Module } from '@nestjs/common';
import { TowersService } from './towers.service.js';
import { TowersController } from './towers.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Tower } from '../../entities/tower.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tower]),
    PassportModule.register({ defaultStrategy: "jwt" }), 
  ],
  providers: [TowersService],
  controllers: [TowersController],
  exports: [TowersService],
})
export class TowersModule {}