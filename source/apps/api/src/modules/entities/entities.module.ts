import { Module } from "@nestjs/common";
import { EntitiesEntitiesReadModule } from "#/modules/entities/entities-read/entities-read.module.ts";

@Module({
  imports: [
    EntitiesEntitiesReadModule,
  ],
})
export class EntitiesModule {}