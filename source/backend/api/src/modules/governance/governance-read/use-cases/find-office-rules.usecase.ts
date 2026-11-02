import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { InstitutionDto } from '#/modules/governance/dto/institution.dto';
import type { OfficeRuleListQueryDto } from '#/modules/governance/dto/office-rule-list-query.dto';
import type { OfficeRulePublicDto } from '#/modules/governance/dto/office-rule-public.dto';
import type { OfficeRuleDto } from '#/modules/governance/dto/office-rule.dto';
import type { OfficeRulesListResponseDto } from '#/modules/governance/dto/office-rules-list-response.dto';
import type { OfficeDto } from '#/modules/governance/dto/office.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { OfficeRuleEntity } from '#/modules/governance/entities/office-rule.entity';
import { listPage } from '#/read/list-page';

/**
 * List office rules.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of OfficeRuleEntity); review it and add business rules here.
 */
@Injectable()
export class FindOfficeRulesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(OfficeRuleEntity);
  }

  private toReadModel(entity: OfficeRuleEntity): OfficeRulePublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kind: entity.kind,
    legalBasisId: entity.legalBasisId,
    licence: entity.licence,
    method: entity.method,
    numericValue: entity.numericValue,
    officeId: entity.officeId,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    textValue: entity.textValue,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as OfficeRulePublicDto;
  }

  async execute(input: OfficeRuleListQueryDto): Promise<OfficeRulesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { rules: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as OfficeRulesListResponseDto;
  }
}
