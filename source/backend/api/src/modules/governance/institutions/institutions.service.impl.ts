import { Injectable } from '@nestjs/common';
import type { InstitutionCollectionDto } from '#/modules/governance/dto/institution-collection.dto';
import type { InstitutionDetailDto } from '#/modules/governance/dto/institution-detail.dto';
import type { InstitutionKeyDto } from '#/modules/governance/dto/institution-key.dto';
import type { InstitutionWindowDto } from '#/modules/governance/dto/institution-window.dto';
import type { OfficeDetailDto } from '#/modules/governance/dto/office-detail.dto';
import type { OfficeKeyDto } from '#/modules/governance/dto/office-key.dto';
import { BrowseInstitutionsUseCase } from '#/modules/governance/institutions/use-cases/browse-institutions.usecase';
import { GetInstitutionUseCase } from '#/modules/governance/institutions/use-cases/get-institution.usecase';
import { GetOfficeUseCase } from '#/modules/governance/institutions/use-cases/get-office.usecase';

/**
 * Institutions: implements the generated GovernanceInstitutionsService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class GovernanceInstitutionsServiceImpl {
  constructor(
    private readonly browseInstitutionsUseCase: BrowseInstitutionsUseCase,
    private readonly getInstitutionUseCase: GetInstitutionUseCase,
    private readonly getOfficeUseCase: GetOfficeUseCase,
  ) {}

  /** Page through public institutions with their names, optionally by code prefix. */
  browseInstitutions(input: InstitutionWindowDto) {
    return this.browseInstitutionsUseCase.execute(input);
  }

  /** One institution with its mandates and offices. */
  getInstitution(input: InstitutionKeyDto) {
    return this.getInstitutionUseCase.execute(input);
  }

  /** One office with everyone who has held it, newest first. */
  getOffice(input: OfficeKeyDto) {
    return this.getOfficeUseCase.execute(input);
  }
}