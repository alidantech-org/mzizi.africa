import { Injectable } from '@nestjs/common';
import type { CandidateDetailResponseDto } from '#/modules/pipeline/dto/candidate-detail-response.dto';
import type { CandidateListQueryDto } from '#/modules/pipeline/dto/candidate-list-query.dto';
import type { CandidateListResponseDto } from '#/modules/pipeline/dto/candidate-list-response.dto';
import type { JobListResponseDto } from '#/modules/pipeline/dto/job-list-response.dto';
import type { PageQueryDto } from '#/modules/pipeline/dto/page-query.dto';
import type { PromoteResponseDto } from '#/modules/pipeline/dto/promote-response.dto';
import type { RunListResponseDto } from '#/modules/pipeline/dto/run-list-response.dto';
import type { SiteListResponseDto } from '#/modules/pipeline/dto/site-list-response.dto';
import { FindCandidatesUseCase } from '#/modules/pipeline/pipeline-review/use-cases/find-candidates.usecase';
import { FindJobsUseCase } from '#/modules/pipeline/pipeline-review/use-cases/find-jobs.usecase';
import { FindRunsUseCase } from '#/modules/pipeline/pipeline-review/use-cases/find-runs.usecase';
import { FindSitesUseCase } from '#/modules/pipeline/pipeline-review/use-cases/find-sites.usecase';
import { GetCandidateDetailUseCase } from '#/modules/pipeline/pipeline-review/use-cases/get-candidate-detail.usecase';
import { PromoteCandidateUseCase } from '#/modules/pipeline/pipeline-review/use-cases/promote-candidate.usecase';

/**
 * Pipeline Review: implements the generated PipelinePipelineReviewService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class PipelinePipelineReviewServiceImpl {
  constructor(
    private readonly findCandidatesUseCase: FindCandidatesUseCase,
    private readonly findJobsUseCase: FindJobsUseCase,
    private readonly findRunsUseCase: FindRunsUseCase,
    private readonly findSitesUseCase: FindSitesUseCase,
    private readonly getCandidateDetailUseCase: GetCandidateDetailUseCase,
    private readonly promoteCandidateUseCase: PromoteCandidateUseCase,
  ) {}

  /** List staged candidates. */
  findCandidates(input: CandidateListQueryDto) {
    return this.findCandidatesUseCase.execute(input);
  }

  /** List data engine jobs. */
  findJobs(input: PageQueryDto) {
    return this.findJobsUseCase.execute(input);
  }

  /** List staging runs. */
  findRuns(input: PageQueryDto) {
    return this.findRunsUseCase.execute(input);
  }

  /** List registered sites. */
  findSites(input: PageQueryDto) {
    return this.findSitesUseCase.execute(input);
  }

  /** Get a staged candidate with payload, issues, lineage and the current canonical record. */
  getCandidateDetail(input: { candidateId: string }) {
    return this.getCandidateDetailUseCase.execute(input);
  }

  /** Promote an approved candidate to a canonical record through the database engine. */
  promoteCandidate(input: { candidateId: string }) {
    return this.promoteCandidateUseCase.execute(input);
  }
}