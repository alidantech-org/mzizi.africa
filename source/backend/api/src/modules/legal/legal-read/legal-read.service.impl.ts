import { Injectable } from '@nestjs/common';
import type { LegalAmendmentChangeListQueryDto } from '#/modules/legal/dto/legal-amendment-change-list-query.dto';
import type { LegalAmendmentChangeResponseDto } from '#/modules/legal/dto/legal-amendment-change-response.dto';
import type { LegalAmendmentChangesListResponseDto } from '#/modules/legal/dto/legal-amendment-changes-list-response.dto';
import type { LegalAmendmentListQueryDto } from '#/modules/legal/dto/legal-amendment-list-query.dto';
import type { LegalAmendmentResponseDto } from '#/modules/legal/dto/legal-amendment-response.dto';
import type { LegalAmendmentsListResponseDto } from '#/modules/legal/dto/legal-amendments-list-response.dto';
import type { LegalAuthorityLinkListQueryDto } from '#/modules/legal/dto/legal-authority-link-list-query.dto';
import type { LegalAuthorityLinkResponseDto } from '#/modules/legal/dto/legal-authority-link-response.dto';
import type { LegalAuthorityLinksListResponseDto } from '#/modules/legal/dto/legal-authority-links-list-response.dto';
import type { LegalInstrumentListQueryDto } from '#/modules/legal/dto/legal-instrument-list-query.dto';
import type { LegalInstrumentResponseDto } from '#/modules/legal/dto/legal-instrument-response.dto';
import type { LegalInstrumentsListResponseDto } from '#/modules/legal/dto/legal-instruments-list-response.dto';
import type { LegalProvisionListQueryDto } from '#/modules/legal/dto/legal-provision-list-query.dto';
import type { LegalProvisionResponseDto } from '#/modules/legal/dto/legal-provision-response.dto';
import type { LegalProvisionsListResponseDto } from '#/modules/legal/dto/legal-provisions-list-response.dto';
import { FindLegalAmendmentChangesUseCase } from '#/modules/legal/legal-read/use-cases/find-legal-amendment-changes.usecase';
import { FindLegalAmendmentsUseCase } from '#/modules/legal/legal-read/use-cases/find-legal-amendments.usecase';
import { FindLegalAuthorityLinksUseCase } from '#/modules/legal/legal-read/use-cases/find-legal-authority-links.usecase';
import { FindLegalInstrumentsUseCase } from '#/modules/legal/legal-read/use-cases/find-legal-instruments.usecase';
import { FindLegalProvisionsUseCase } from '#/modules/legal/legal-read/use-cases/find-legal-provisions.usecase';
import { GetLegalAmendmentByIdUseCase } from '#/modules/legal/legal-read/use-cases/get-legal-amendment-by-id.usecase';
import { GetLegalAmendmentChangeByIdUseCase } from '#/modules/legal/legal-read/use-cases/get-legal-amendment-change-by-id.usecase';
import { GetLegalAuthorityLinkByIdUseCase } from '#/modules/legal/legal-read/use-cases/get-legal-authority-link-by-id.usecase';
import { GetLegalInstrumentByIdUseCase } from '#/modules/legal/legal-read/use-cases/get-legal-instrument-by-id.usecase';
import { GetLegalProvisionByIdUseCase } from '#/modules/legal/legal-read/use-cases/get-legal-provision-by-id.usecase';

/**
 * Legal Read: implements the generated LegalLegalReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class LegalLegalReadServiceImpl {
  constructor(
    private readonly findLegalAmendmentChangesUseCase: FindLegalAmendmentChangesUseCase,
    private readonly findLegalAmendmentsUseCase: FindLegalAmendmentsUseCase,
    private readonly findLegalAuthorityLinksUseCase: FindLegalAuthorityLinksUseCase,
    private readonly findLegalInstrumentsUseCase: FindLegalInstrumentsUseCase,
    private readonly findLegalProvisionsUseCase: FindLegalProvisionsUseCase,
    private readonly getLegalAmendmentByIdUseCase: GetLegalAmendmentByIdUseCase,
    private readonly getLegalAmendmentChangeByIdUseCase: GetLegalAmendmentChangeByIdUseCase,
    private readonly getLegalAuthorityLinkByIdUseCase: GetLegalAuthorityLinkByIdUseCase,
    private readonly getLegalInstrumentByIdUseCase: GetLegalInstrumentByIdUseCase,
    private readonly getLegalProvisionByIdUseCase: GetLegalProvisionByIdUseCase,
  ) {}

  /** List legal amendment changes. */
  findLegalAmendmentChanges(input: LegalAmendmentChangeListQueryDto) {
    return this.findLegalAmendmentChangesUseCase.execute(input);
  }

  /** List legal amendments. */
  findLegalAmendments(input: LegalAmendmentListQueryDto) {
    return this.findLegalAmendmentsUseCase.execute(input);
  }

  /** List legal authority links. */
  findLegalAuthorityLinks(input: LegalAuthorityLinkListQueryDto) {
    return this.findLegalAuthorityLinksUseCase.execute(input);
  }

  /** List legal instruments. */
  findLegalInstruments(input: LegalInstrumentListQueryDto) {
    return this.findLegalInstrumentsUseCase.execute(input);
  }

  /** List legal provisions. */
  findLegalProvisions(input: LegalProvisionListQueryDto) {
    return this.findLegalProvisionsUseCase.execute(input);
  }

  /** Get legal amendments by id. */
  getLegalAmendmentById(input: { amendmentId: string }) {
    return this.getLegalAmendmentByIdUseCase.execute(input);
  }

  /** Get legal amendment changes by id. */
  getLegalAmendmentChangeById(input: { changeId: string }) {
    return this.getLegalAmendmentChangeByIdUseCase.execute(input);
  }

  /** Get legal authority links by id. */
  getLegalAuthorityLinkById(input: { linkId: string }) {
    return this.getLegalAuthorityLinkByIdUseCase.execute(input);
  }

  /** Get legal instruments by id. */
  getLegalInstrumentById(input: { instrumentId: string }) {
    return this.getLegalInstrumentByIdUseCase.execute(input);
  }

  /** Get legal provisions by id. */
  getLegalProvisionById(input: { provisionId: string }) {
    return this.getLegalProvisionByIdUseCase.execute(input);
  }
}