import { Module, type Type } from "@nestjs/common";
import { ExperienceExperienceRepository } from "#/modules/experience/features/experience/repositories/experience.repository.ts";
import { GetCalendarUseCase } from "#/modules/experience/features/experience/use-cases/get-calendar.usecase.ts";
import { GetContextUseCase } from "#/modules/experience/features/experience/use-cases/get-context.usecase.ts";
import { GetFacilityUseCase } from "#/modules/experience/features/experience/use-cases/get-facility.usecase.ts";
import { ListFacilitiesUseCase } from "#/modules/experience/features/experience/use-cases/list-facilities.usecase.ts";
import { ListFactsUseCase } from "#/modules/experience/features/experience/use-cases/list-facts.usecase.ts";

import { ExperienceExperienceController } from "./experience.controller.ts";
import {
  ExperienceExperienceService,
  ExperienceExperienceServiceImpl,
} from "./experience.service.ts";

@Module({
  controllers: [ExperienceExperienceController],
  providers: [
    {
      provide: ExperienceExperienceService,
      useClass: ExperienceExperienceServiceImpl satisfies Type<ExperienceExperienceService>,
    },
    GetCalendarUseCase,
    GetContextUseCase,
    GetFacilityUseCase,
    ListFacilitiesUseCase,
    ListFactsUseCase,
    ExperienceExperienceRepository,
  ],
  exports: [ExperienceExperienceService],
})
export class ExperienceExperienceModule {}
