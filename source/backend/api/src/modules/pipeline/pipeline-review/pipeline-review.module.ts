import { Module, type Type } from "@nestjs/common";
import { PipelinePipelineReviewServiceImpl } from "#/modules/pipeline/pipeline-review/pipeline-review.service.impl.ts";
import { FindCandidatesUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-candidates.usecase.ts";
import { FindJobsUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-jobs.usecase.ts";
import { FindRunsUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-runs.usecase.ts";
import { FindSitesUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-sites.usecase.ts";
import { GetCandidateDetailUseCase } from "#/modules/pipeline/pipeline-review/use-cases/get-candidate-detail.usecase.ts";
import { PromoteCandidateUseCase } from "#/modules/pipeline/pipeline-review/use-cases/promote-candidate.usecase.ts";

import { PipelinePipelineReviewController } from "./pipeline-review.controller.ts";
import { PipelinePipelineReviewService } from "./pipeline-review.service.ts";

@Module({
  controllers: [PipelinePipelineReviewController],
  providers: [
    {
      provide: PipelinePipelineReviewService,
      useClass: PipelinePipelineReviewServiceImpl satisfies Type<PipelinePipelineReviewService>,
    },
    FindCandidatesUseCase,
    FindJobsUseCase,
    FindRunsUseCase,
    FindSitesUseCase,
    GetCandidateDetailUseCase,
    PromoteCandidateUseCase,
  ],
  exports: [PipelinePipelineReviewService],
})
export class PipelinePipelineReviewModule {}