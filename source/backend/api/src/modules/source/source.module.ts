import { Module } from "@nestjs/common";
import { SourceProvenanceModule } from "#/modules/source/features/provenance/provenance.module.ts";

@Module({
  imports: [SourceProvenanceModule],
})
export class SourceModule {}
