import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { PeopleListResponseDto } from '#/modules/governance/dto/people-list-response.dto';
import type { PersonListQueryDto } from '#/modules/governance/dto/person-list-query.dto';
import type { PersonPublicDto } from '#/modules/governance/dto/person-public.dto';
import type { PersonDto } from '#/modules/governance/dto/person.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { PersonEntity } from '#/modules/governance/entities/person.entity';

/**
 * List people.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of PersonEntity); review it and add business rules here.
 */
@Injectable()
export class FindPeopleUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PersonEntity);
  }

  private toReadModel(entity: PersonEntity): PersonPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    birthDate: entity.birthDate,
    birthDatePrecision: entity.birthDatePrecision,
    birthPlaceId: entity.birthPlaceId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    deathDate: entity.deathDate,
    deathDatePrecision: entity.deathDatePrecision,
    displayName: entity.displayName,
    familyName: entity.familyName,
    givenName: entity.givenName,
    id: entity.id,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    lifeStatus: entity.lifeStatus,
    method: entity.method,
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
    } as unknown as PersonPublicDto;
  }

  async execute(input: PersonListQueryDto): Promise<PeopleListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.lifeStatus !== undefined) where.lifeStatus = input.lifeStatus;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<PersonEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      people: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as PeopleListResponseDto;
  }
}