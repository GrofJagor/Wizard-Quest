import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Tower } from './entities/tower.entity.js';
import { Quest } from './entities/quest.entity.js';
import { Wizard } from './entities/wizard.entity.js';
import { UsersModule } from './users/users/users.module.js';
import { AuthModule } from './auth/auth/auth.module.js';
import { QuestsModule } from './quests/quests/quests.module.js';
import { WizardsModule } from './users/wizards/wizards.module.js';
import { TowersModule } from './towers/towers/towers.module.js';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mssql", 
        host: config.get<string>("DB_HOST", "localhost"),
        port: +config.get<number>("DB_PORT", 1433),
        username: config.get<string>("DB_USERNAME"),
        password: config.get<string>("DB_PASSWORD"),
        database: config.get<string>("DB_DATABASE"),
        entities: [User, Wizard, Tower, Quest],
        synchronize: true, 
        options: {
          encrypt: false, 
          trustServerCertificate: true, 
        },
      }),
    }),
    UsersModule,
    AuthModule,
    QuestsModule,
    WizardsModule,
    TowersModule,
  ],
})
export class AppModule {}