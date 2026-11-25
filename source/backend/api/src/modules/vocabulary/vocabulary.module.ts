import { Module } from "@nestjs/common";
import { VocabularyTermsModule } from "#/modules/vocabulary/features/terms/terms.module.ts";

@Module({
  imports: [VocabularyTermsModule],
})
export class VocabularyModule {}
