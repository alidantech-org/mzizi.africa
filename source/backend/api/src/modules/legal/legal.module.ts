import { Module } from "@nestjs/common";
import { LegalLegalReadModule } from "#/modules/legal/legal-read/legal-read.module.ts";

@Module({
  imports: [
    LegalLegalReadModule,
  ],
})
export class LegalModule {}