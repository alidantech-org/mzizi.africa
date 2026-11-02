import { Module, type Type } from "@nestjs/common";
import { PipelinePipelineReviewServiceImpl } from "#/modules/pipeline/pipeline-review/pipeline-review.service.impl.ts";
import { ApplyReviewDecisionsUseCase } from "#/modules/pipeline/pipeline-review/use-cases/apply-review-decisions.usecase.ts";
import { ApproveAssessmentUseCase } from "#/modules/pipeline/pipeline-review/use-cases/approve-assessment.usecase.ts";
import { FindAssessmentsUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-assessments.usecase.ts";
import { FindCandidatesUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-candidates.usecase.ts";
import { FindDossiersUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-dossiers.usecase.ts";
import { FindJobsUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-jobs.usecase.ts";
import { FindRunsUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-runs.usecase.ts";
import { FindSitesUseCase } from "#/modules/pipeline/pipeline-review/use-cases/find-sites.usecase.ts";
import { GetCandidateDetailUseCase } from "#/modules/pipeline/pipeline-review/use-cases/get-candidate-detail.usecase.ts";
import { PromoteCandidateUseCase } from "#/modules/pipeline/pipeline-review/use-cases/promote-candidate.usecase.ts";
import { RejectAssessmentUseCase } from "#/modules/pipeline/pipeline-review/use-cases/reject-assessment.usecase.ts";

import { PipelinePipelineReviewController } from "./pipeline-review.controller.ts";
import { PipelinePipelineReviewService } from "./pipeline-review.service.ts";

@Module({
  controllers: [PipelinePipelineReviewController],
  providers: [
    {
      provide: PipelinePipelineReviewService,
      useClass: PipelinePipelineReviewServiceImpl satisfies Type<PipelinePipelineReviewService>,
    },
    ApplyReviewDecisionsUseCase,
    ApproveAssessmentUseCase,
    FindAssessmentsUseCase,
    FindCandidatesUseCase,
    FindDossiersUseCase,
    FindJobsUseCase,
    FindRunsUseCase,
    FindSitesUseCase,
    GetCandidateDetailUseCase,
    PromoteCandidateUseCase,
    RejectAssessmentUseCase,
  ],
  exports: [PipelinePipelineReviewService],
})
export class PipelinePipelineReviewModule {}