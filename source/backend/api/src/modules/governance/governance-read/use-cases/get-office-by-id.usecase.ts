import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { InstitutionDto } from '#/modules/governance/dto/institution.dto';
import type { OfficePublicDto } from '#/modules/governance/dto/office-public.dto';
import type { OfficeResponseDto } from '#/modules/governance/dto/office-response.dto';
import type { OfficeDto } from '#/modules/governance/dto/office.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { OfficeEntity } from '#/modules/governance/entities/office.entity';

/**
 * Get offices by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of OfficeEntity); review it and add business rules here.
 */
@Injectable()
export class GetOfficeByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(OfficeEntity);
  }

  private toReadModel(entity: OfficeEntity): OfficePublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    description: entity.description,
    id: entity.id,
    institutionId: entity.institutionId,
    isCurrent: entity.isCurrent,
    isSingleton: entity.isSingleton,
    licence: entity.licence,
    method: entity.method,
    name: entity.name,
    parentOfficeId: entity.parentOfficeId,
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
    } as unknown as OfficePublicDto;
  }

  async execute(input: { officeId: string }): Promise<OfficeResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.officeId } as never);
    if (!entity) throw new NotFoundException('Office not found');
    return {
      office: this.toReadModel(entity),
    } as unknown as OfficeResponseDto;
  }
}