import { Injectable } from '@nestjs/common';
import { GetGeographyGovernanceUseCase } from '#/modules/governance/governance-read/use-cases/get-geography-governance.usecase';
import type { InstitutionListQueryDto } from '#/modules/governance/dto/institution-list-query.dto';
import type { InstitutionRelationshipListQueryDto } from '#/modules/governance/dto/institution-relationship-list-query.dto';
import type { InstitutionRelationshipResponseDto } from '#/modules/governance/dto/institution-relationship-response.dto';
import type { InstitutionRelationshipsListResponseDto } from '#/modules/governance/dto/institution-relationships-list-response.dto';
import type { InstitutionResponseDto } from '#/modules/governance/dto/institution-response.dto';
import type { InstitutionsListResponseDto } from '#/modules/governance/dto/institutions-list-response.dto';
import type { OfficeHolderListQueryDto } from '#/modules/governance/dto/office-holder-list-query.dto';
import type { OfficeHolderResponseDto } from '#/modules/governance/dto/office-holder-response.dto';
import type { OfficeHoldersListResponseDto } from '#/modules/governance/dto/office-holders-list-response.dto';
import type { OfficeListQueryDto } from '#/modules/governance/dto/office-list-query.dto';
import type { OfficeResponseDto } from '#/modules/governance/dto/office-response.dto';
import type { OfficeRuleListQueryDto } from '#/modules/governance/dto/office-rule-list-query.dto';
import type { OfficeRuleResponseDto } from '#/modules/governance/dto/office-rule-response.dto';
import type { OfficeRulesListResponseDto } from '#/modules/governance/dto/office-rules-list-response.dto';
import type { OfficesListResponseDto } from '#/modules/governance/dto/offices-list-response.dto';
import type { PeopleListResponseDto } from '#/modules/governance/dto/people-list-response.dto';
import type { PersonListQueryDto } from '#/modules/governance/dto/person-list-query.dto';
import type { PersonNameListQueryDto } from '#/modules/governance/dto/person-name-list-query.dto';
import type { PersonNameResponseDto } from '#/modules/governance/dto/person-name-response.dto';
import type { PersonNamesListResponseDto } from '#/modules/governance/dto/person-names-list-response.dto';
import type { PersonResponseDto } from '#/modules/governance/dto/person-response.dto';
import type { SelectionProcedureListQueryDto } from '#/modules/governance/dto/selection-procedure-list-query.dto';
import type { SelectionProcedureResponseDto } from '#/modules/governance/dto/selection-procedure-response.dto';
import type { SelectionProceduresListResponseDto } from '#/modules/governance/dto/selection-procedures-list-response.dto';
import type { SelectionStageListQueryDto } from '#/modules/governance/dto/selection-stage-list-query.dto';
import type { SelectionStageResponseDto } from '#/modules/governance/dto/selection-stage-response.dto';
import type { SelectionStagesListResponseDto } from '#/modules/governance/dto/selection-stages-list-response.dto';
import { FindInstitutionRelationshipsUseCase } from '#/modules/governance/governance-read/use-cases/find-institution-relationships.usecase';
import { FindInstitutionsUseCase } from '#/modules/governance/governance-read/use-cases/find-institutions.usecase';
import { FindOfficeHoldersUseCase } from '#/modules/governance/governance-read/use-cases/find-office-holders.usecase';
import { FindOfficeRulesUseCase } from '#/modules/governance/governance-read/use-cases/find-office-rules.usecase';
import { FindOfficesUseCase } from '#/modules/governance/governance-read/use-cases/find-offices.usecase';
import { FindPeopleUseCase } from '#/modules/governance/governance-read/use-cases/find-people.usecase';
import { FindPersonNamesUseCase } from '#/modules/governance/governance-read/use-cases/find-person-names.usecase';
import { FindSelectionProceduresUseCase } from '#/modules/governance/governance-read/use-cases/find-selection-procedures.usecase';
import { FindSelectionStagesUseCase } from '#/modules/governance/governance-read/use-cases/find-selection-stages.usecase';
import { GetInstitutionByIdUseCase } from '#/modules/governance/governance-read/use-cases/get-institution-by-id.usecase';
import { GetInstitutionRelationshipByIdUseCase } from '#/modules/governance/governance-read/use-cases/get-institution-relationship-by-id.usecase';
import { GetOfficeByIdUseCase } from '#/modules/governance/governance-read/use-cases/get-office-by-id.usecase';
import { GetOfficeHolderByIdUseCase } from '#/modules/governance/governance-read/use-cases/get-office-holder-by-id.usecase';
import { GetOfficeRuleByIdUseCase } from '#/modules/governance/governance-read/use-cases/get-office-rule-by-id.usecase';
import { GetPersonByIdUseCase } from '#/modules/governance/governance-read/use-cases/get-person-by-id.usecase';
import { GetPersonNameByIdUseCase } from '#/modules/governance/governance-read/use-cases/get-person-name-by-id.usecase';
import { GetSelectionProcedureByIdUseCase } from '#/modules/governance/governance-read/use-cases/get-selection-procedure-by-id.usecase';
import { GetSelectionStageByIdUseCase } from '#/modules/governance/governance-read/use-cases/get-selection-stage-by-id.usecase';

/**
 * Governance Read: implements the generated GovernanceGovernanceReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class GovernanceGovernanceReadServiceImpl {
  constructor(
    private readonly getGeographyGovernanceUseCase: GetGeographyGovernanceUseCase,
    private readonly findInstitutionRelationshipsUseCase: FindInstitutionRelationshipsUseCase,
    private readonly findInstitutionsUseCase: FindInstitutionsUseCase,
    private readonly findOfficeHoldersUseCase: FindOfficeHoldersUseCase,
    private readonly findOfficeRulesUseCase: FindOfficeRulesUseCase,
    private readonly findOfficesUseCase: FindOfficesUseCase,
    private readonly findPeopleUseCase: FindPeopleUseCase,
    private readonly findPersonNamesUseCase: FindPersonNamesUseCase,
    private readonly findSelectionProceduresUseCase: FindSelectionProceduresUseCase,
    private readonly findSelectionStagesUseCase: FindSelectionStagesUseCase,
    private readonly getInstitutionByIdUseCase: GetInstitutionByIdUseCase,
    private readonly getInstitutionRelationshipByIdUseCase: GetInstitutionRelationshipByIdUseCase,
    private readonly getOfficeByIdUseCase: GetOfficeByIdUseCase,
    private readonly getOfficeHolderByIdUseCase: GetOfficeHolderByIdUseCase,
    private readonly getOfficeRuleByIdUseCase: GetOfficeRuleByIdUseCase,
    private readonly getPersonByIdUseCase: GetPersonByIdUseCase,
    private readonly getPersonNameByIdUseCase: GetPersonNameByIdUseCase,
    private readonly getSelectionProcedureByIdUseCase: GetSelectionProcedureByIdUseCase,
    private readonly getSelectionStageByIdUseCase: GetSelectionStageByIdUseCase,
  ) {}

  /** List institution relationships. */
  findInstitutionRelationships(input: InstitutionRelationshipListQueryDto) {
    return this.findInstitutionRelationshipsUseCase.execute(input);
  }

  /** Institutions, offices and current office holders linked to a geography entity. */
  getGeographyGovernance(input: { entityId: string }) {
    return this.getGeographyGovernanceUseCase.execute(input);
  }

  /** List institutions. */
  findInstitutions(input: InstitutionListQueryDto) {
    return this.findInstitutionsUseCase.execute(input);
  }

  /** List office holders. */
  findOfficeHolders(input: OfficeHolderListQueryDto) {
    return this.findOfficeHoldersUseCase.execute(input);
  }

  /** List office rules. */
  findOfficeRules(input: OfficeRuleListQueryDto) {
    return this.findOfficeRulesUseCase.execute(input);
  }

  /** List offices. */
  findOffices(input: OfficeListQueryDto) {
    return this.findOfficesUseCase.execute(input);
  }

  /** List people. */
  findPeople(input: PersonListQueryDto) {
    return this.findPeopleUseCase.execute(input);
  }

  /** List person names. */
  findPersonNames(input: PersonNameListQueryDto) {
    return this.findPersonNamesUseCase.execute(input);
  }

  /** List selection procedures. */
  findSelectionProcedures(input: SelectionProcedureListQueryDto) {
    return this.findSelectionProceduresUseCase.execute(input);
  }

  /** List selection stages. */
  findSelectionStages(input: SelectionStageListQueryDto) {
    return this.findSelectionStagesUseCase.execute(input);
  }

  /** Get institutions by id. */
  getInstitutionById(input: { institutionId: string }) {
    return this.getInstitutionByIdUseCase.execute(input);
  }

  /** Get institution relationships by id. */
  getInstitutionRelationshipById(input: { relationshipId: string }) {
    return this.getInstitutionRelationshipByIdUseCase.execute(input);
  }

  /** Get offices by id. */
  getOfficeById(input: { officeId: string }) {
    return this.getOfficeByIdUseCase.execute(input);
  }

  /** Get office holders by id. */
  getOfficeHolderById(input: { holderId: string }) {
    return this.getOfficeHolderByIdUseCase.execute(input);
  }

  /** Get office rules by id. */
  getOfficeRuleById(input: { ruleId: string }) {
    return this.getOfficeRuleByIdUseCase.execute(input);
  }

  /** Get people by id. */
  getPersonById(input: { personId: string }) {
    return this.getPersonByIdUseCase.execute(input);
  }

  /** Get person names by id. */
  getPersonNameById(input: { personNameId: string }) {
    return this.getPersonNameByIdUseCase.execute(input);
  }

  /** Get selection procedures by id. */
  getSelectionProcedureById(input: { procedureId: string }) {
    return this.getSelectionProcedureByIdUseCase.execute(input);
  }

  /** Get selection stages by id. */
  getSelectionStageById(input: { stageId: string }) {
    return this.getSelectionStageByIdUseCase.execute(input);
  }
}