import { Module } from "@nestjs/common";
import { StructureStructureModule } from "#/modules/structure/features/structure/structure.module.ts";

@Module({
  imports: [StructureStructureModule],
})
export class StructureModule {}
