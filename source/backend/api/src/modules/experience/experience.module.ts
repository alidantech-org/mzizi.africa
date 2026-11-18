import { Module } from "@nestjs/common";
import { ExperienceExperienceModule } from "#/modules/experience/features/experience/experience.module.ts";

@Module({
  imports: [ExperienceExperienceModule],
})
export class ExperienceModule {}
