import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { readOptions, writeOptions } from "./database/database.config";
import { HealthController } from "./health/health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ name: "read", useFactory: readOptions }),
    TypeOrmModule.forRootAsync({ name: "write", useFactory: writeOptions }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
