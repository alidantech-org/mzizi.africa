import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { PersonProfileListQueryDto } from '#/modules/person/dto/person-profile-list-query.dto';
import type { PersonProfilePublicDto } from '#/modules/person/dto/person-profile-public.dto';
import type { PersonProfileDto } from '#/modules/person/dto/person-profile.dto';
import type { PersonProfilesListResponseDto } from '#/modules/person/dto/person-profiles-list-response.dto';
import type { PersonDto } from '#/modules/person/dto/person.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { PersonProfileEntity } from '#/modules/person/entities/person-profile.entity';
import { listPage } from '#/read/list-page';

/**
 * List person profiles.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of PersonProfileEntity); review it and add business rules here.
 */
@Injectable()
export class FindPersonProfilesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PersonProfileEntity);
  }

  private toReadModel(entity: PersonProfileEntity): PersonProfilePublicDto {
    return {
    biography: entity.biography,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    language: entity.language,
    nationalityId: entity.nationalityId,
    occupation: entity.occupation,
    personId: entity.personId,
    summary: entity.summary,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as PersonProfilePublicDto;
  }

  async execute(input: PersonProfileListQueryDto): Promise<PersonProfilesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { profiles: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as PersonProfilesListResponseDto;
  }
}
