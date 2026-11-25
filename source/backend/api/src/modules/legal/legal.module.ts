import { Module } from "@nestjs/common";
import { LegalLawModule } from "#/modules/legal/features/law/law.module.ts";

@Module({
  imports: [LegalLawModule],
})
export class LegalModule {}
