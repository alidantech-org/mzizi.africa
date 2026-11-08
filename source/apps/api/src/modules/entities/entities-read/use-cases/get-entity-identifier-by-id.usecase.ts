import { isHiddenFromCaller } from '#/read/restricted-identifiers';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { EntityIdentifierPublicDto } from '#/modules/entities/dto/entity-identifier-public.dto';
import type { EntityIdentifierResponseDto } from '#/modules/entities/dto/entity-identifier-response.dto';
import type { EntityIdentifierDto } from '#/modules/entities/dto/entity-identifier.dto';
import type { LegalEntityDto } from '#/modules/entities/dto/legal-entity.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { EntityIdentifierEntity } from '#/modules/entities/entities/entity-identifier.entity';

/**
 * Get entity identifiers by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of EntityIdentifierEntity); review it and add business rules here.
 */
@Injectable()
export class GetEntityIdentifierByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(EntityIdentifierEntity);
  }

  private toReadModel(entity: EntityIdentifierEntity): EntityIdentifierPublicDto {
    return {
    createdAt: entity.createdAt,
    entityId: entity.entityId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    issuingAuthorityId: entity.issuingAuthorityId,
    schemeId: entity.schemeId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    value: entity.value,
    version: entity.version,
    } as unknown as EntityIdentifierPublicDto;
  }

  async execute(input: { identifierId: string }): Promise<EntityIdentifierResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.identifierId } as never);
    if (!entity || (await isHiddenFromCaller(this.dataSource, entity.schemeId))) throw new NotFoundException('Identifier not found');
    return {
      identifier: this.toReadModel(entity),
    } as unknown as EntityIdentifierResponseDto;
  }
}