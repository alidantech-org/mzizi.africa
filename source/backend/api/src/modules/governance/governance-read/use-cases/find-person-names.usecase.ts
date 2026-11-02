import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { PersonNameListQueryDto } from '#/modules/governance/dto/person-name-list-query.dto';
import type { PersonNamePublicDto } from '#/modules/governance/dto/person-name-public.dto';
import type { PersonNameDto } from '#/modules/governance/dto/person-name.dto';
import type { PersonNamesListResponseDto } from '#/modules/governance/dto/person-names-list-response.dto';
import type { PersonDto } from '#/modules/governance/dto/person.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { PersonNameEntity } from '#/modules/governance/entities/person-name.entity';
import { listPage } from '#/read/list-page';

/**
 * List person names.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of PersonNameEntity); review it and add business rules here.
 */
@Injectable()
export class FindPersonNamesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PersonNameEntity);
  }

  private toReadModel(entity: PersonNameEntity): PersonNamePublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kind: entity.kind,
    language: entity.language,
    licence: entity.licence,
    method: entity.method,
    name: entity.name,
    personId: entity.personId,
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
    } as unknown as PersonNamePublicDto;
  }

  async execute(input: PersonNameListQueryDto): Promise<PersonNamesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { personNames: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as PersonNamesListResponseDto;
  }
}
