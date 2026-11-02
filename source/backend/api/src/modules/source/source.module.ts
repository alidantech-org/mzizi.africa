import { Module } from "@nestjs/common";
import { SourceSourceReadModule } from "#/modules/source/source-read/source-read.module.ts";

@Module({
  imports: [
    SourceSourceReadModule,
  ],
})
export class SourceModule {}