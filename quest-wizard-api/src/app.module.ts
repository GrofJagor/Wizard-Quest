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


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mssql", // SQL Server Express. Swap to 'postgres'/'mysql' if that's your target instead.
        host: config.get<string>("DB_HOST", "localhost"),
        port: +config.get<number>("DB_PORT", 1433),
        username: config.get<string>("DB_USERNAME"),
        password: config.get<string>("DB_PASSWORD"),
        database: config.get<string>("DB_DATABASE"),
        entities: [User, Wizard, Tower, Quest],
        synchronize: true, // dev only — use migrations in production
        options: {
          encrypt: false, // set true if connecting to Azure SQL
          trustServerCertificate: true, // needed for local SQL Server Express over self-signed cert
        },
      }),
    }),
    UsersModule,
    AuthModule,
    QuestsModule,
  ],
})
export class AppModule {}