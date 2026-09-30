import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";

import { QuestsService } from "./quests.service.js";
import { QuestsController } from "./quests.controller.js";
import { Quest } from "../../entities/quest.entity.js";
import { Wizard } from "../../entities/wizard.entity.js";
import { Tower } from "../../entities/tower.entity.js";
 
@Module({
  imports: [
    TypeOrmModule.forFeature([Quest, Wizard, Tower]),
    PassportModule.register({ defaultStrategy: "jwt" }), 
  ],
  providers: [QuestsService],
  controllers: [QuestsController],
  exports: [QuestsService],
})
export class QuestsModule {}
 