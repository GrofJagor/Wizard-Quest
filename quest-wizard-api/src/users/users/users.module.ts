import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity.js";
import { Wizard } from "../../entities/wizard.entity.js";
import { Tower } from "../../entities/tower.entity.js";
import { Quest } from "../../entities/quest.entity.js";
import { UsersService } from "./users.service.js";
import { UsersController } from "./users.controller.js";
import { PassportModule } from "@nestjs/passport";


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wizard, Tower, Quest]),
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
 