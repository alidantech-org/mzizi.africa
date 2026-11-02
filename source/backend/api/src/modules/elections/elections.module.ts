import { Module } from "@nestjs/common";
import { ElectionsElectionsReadModule } from "#/modules/elections/elections-read/elections-read.module.ts";

@Module({
  imports: [
    ElectionsElectionsReadModule,
  ],
})
export class ElectionsModule {}