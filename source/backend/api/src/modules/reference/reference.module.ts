import { Module } from "@nestjs/common";
import { ReferenceReferenceReadModule } from "#/modules/reference/reference-read/reference-read.module.ts";

@Module({
  imports: [
    ReferenceReferenceReadModule,
  ],
})
export class ReferenceModule {}