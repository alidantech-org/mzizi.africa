import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { InstitutionRelationshipPublicDto } from '#/modules/governance/dto/institution-relationship-public.dto';
import type { InstitutionRelationshipResponseDto } from '#/modules/governance/dto/institution-relationship-response.dto';
import type { InstitutionRelationshipDto } from '#/modules/governance/dto/institution-relationship.dto';
import type { InstitutionDto } from '#/modules/governance/dto/institution.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { InstitutionRelationshipEntity } from '#/modules/governance/entities/institution-relationship.entity';

/**
 * Get institution relationships by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of InstitutionRelationshipEntity); review it and add business rules here.
 */
@Injectable()
export class GetInstitutionRelationshipByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(InstitutionRelationshipEntity);
  }

  private toReadModel(entity: InstitutionRelationshipEntity): InstitutionRelationshipPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    childInstitutionId: entity.childInstitutionId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kind: entity.kind,
    legalBasisId: entity.legalBasisId,
    licence: entity.licence,
    method: entity.method,
    parentInstitutionId: entity.parentInstitutionId,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as InstitutionRelationshipPublicDto;
  }

  async execute(input: { relationshipId: string }): Promise<InstitutionRelationshipResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.relationshipId } as never);
    if (!entity) throw new NotFoundException('InstitutionRelationship not found');
    return {
      relationship: this.toReadModel(entity),
    } as unknown as InstitutionRelationshipResponseDto;
  }
}