import { Injectable } from '@nestjs/common';
import type { ApplyReviewsQueryDto } from '#/modules/pipeline/dto/apply-reviews-query.dto';
import type { AssessmentListResponseDto } from '#/modules/pipeline/dto/assessment-list-response.dto';
import type { DossierListResponseDto } from '#/modules/pipeline/dto/dossier-list-response.dto';
import type { CandidateDetailResponseDto } from '#/modules/pipeline/dto/candidate-detail-response.dto';
import type { CandidateListQueryDto } from '#/modules/pipeline/dto/candidate-list-query.dto';
import type { CandidateListResponseDto } from '#/modules/pipeline/dto/candidate-list-response.dto';
import type { JobListResponseDto } from '#/modules/pipeline/dto/job-list-response.dto';
import type { PageQueryDto } from '#/modules/pipeline/dto/page-query.dto';
import type { PromoteResponseDto } from '#/modules/pipeline/dto/promote-response.dto';
import type { RunListResponseDto } from '#/modules/pipeline/dto/run-list-response.dto';
import type { SiteListResponseDto } from '#/modules/pipeline/dto/site-list-response.dto';
import { ApplyReviewDecisionsUseCase } from '#/modules/pipeline/pipeline-review/use-cases/apply-review-decisions.usecase';
import { DraftAssessmentUseCase } from '#/modules/pipeline/pipeline-review/use-cases/draft-assessment.usecase';
import { FindCapturesUseCase } from '#/modules/pipeline/pipeline-review/use-cases/find-captures.usecase';
import { FindChecksUseCase } from '#/modules/pipeline/pipeline-review/use-cases/find-checks.usecase';
import { FindDocumentsUseCase } from '#/modules/pipeline/pipeline-review/use-cases/find-documents.usecase';
import { FindStructureVersionsUseCase } from '#/modules/pipeline/pipeline-review/use-cases/find-structure-versions.usecase';
import type { DraftAssessmentRequestDto } from '#/modules/pipeline/dto/draft-assessment-request.dto';
import { ApproveAssessmentUseCase } from '#/modules/pipeline/pipeline-review/use-cases/approve-assessment.usecase';
import { FindAssessmentsUseCase } from '#/modules/pipeline/pipeline-review/use-cases/find-assessments.usecase';
import { FindDossiersUseCase } from '#/modules/pipeline/pipeline-review/use-cases/find-dossiers.usecase';
import { RejectAssessmentUseCase } from '#/modules/pipeline/pipeline-review/use-cases/reject-assessment.usecase';
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
    private readonly applyReviewDecisionsUseCase: ApplyReviewDecisionsUseCase,
    private readonly approveAssessmentUseCase: ApproveAssessmentUseCase,
    private readonly findAssessmentsUseCase: FindAssessmentsUseCase,
    private readonly findDossiersUseCase: FindDossiersUseCase,
    private readonly rejectAssessmentUseCase: RejectAssessmentUseCase,
    private readonly findCandidatesUseCase: FindCandidatesUseCase,
    private readonly findJobsUseCase: FindJobsUseCase,
    private readonly findRunsUseCase: FindRunsUseCase,
    private readonly findSitesUseCase: FindSitesUseCase,
    private readonly getCandidateDetailUseCase: GetCandidateDetailUseCase,
    private readonly promoteCandidateUseCase: PromoteCandidateUseCase,
    private readonly draftAssessmentUseCase: DraftAssessmentUseCase,
    private readonly findCapturesUseCase: FindCapturesUseCase,
    private readonly findChecksUseCase: FindChecksUseCase,
    private readonly findDocumentsUseCase: FindDocumentsUseCase,
    private readonly findStructureVersionsUseCase: FindStructureVersionsUseCase,
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

  /** Apply recorded review decisions to their candidates. */
  applyReviewDecisions(input: ApplyReviewsQueryDto) {
    return this.applyReviewDecisionsUseCase.execute(input);
  }

  /** Approve a site assessment (a named human holding assessment.approve). */
  approveAssessment(input: { assessmentId: string }) {
    return this.approveAssessmentUseCase.execute(input);
  }

  /** Reject a site assessment. */
  rejectAssessment(input: { assessmentId: string }) {
    return this.rejectAssessmentUseCase.execute(input);
  }

  /** List site assessments. */
  findAssessments(input: PageQueryDto) {
    return this.findAssessmentsUseCase.execute(input);
  }

  /** List jurisdiction dossiers. */
  findDossiers(input: PageQueryDto) {
    return this.findDossiersUseCase.execute(input);
  }

  /** List source documents. */
  findDocuments(input: PageQueryDto) {
    return this.findDocumentsUseCase.execute(input);
  }

  /** List captures. */
  findCaptures(input: PageQueryDto) {
    return this.findCapturesUseCase.execute(input);
  }

  /** List structure versions. */
  findStructureVersions(input: PageQueryDto) {
    return this.findStructureVersionsUseCase.execute(input);
  }

  /** List site checks. */
  findChecks(input: PageQueryDto) {
    return this.findChecksUseCase.execute(input);
  }

  /** Draft an assessment (in_review; never authorises collection). */
  draftAssessment(input: DraftAssessmentRequestDto) {
    return this.draftAssessmentUseCase.execute(input);
  }
}
