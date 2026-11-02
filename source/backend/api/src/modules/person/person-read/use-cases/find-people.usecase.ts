import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { PeopleListResponseDto } from '#/modules/person/dto/people-list-response.dto';
import type { PersonListQueryDto } from '#/modules/person/dto/person-list-query.dto';
import type { PersonPublicDto } from '#/modules/person/dto/person-public.dto';
import type { PersonDto } from '#/modules/person/dto/person.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { PersonEntity } from '#/modules/person/entities/person.entity';
import { listPage } from '#/read/list-page';

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
    birthDate: entity.birthDate,
    birthDatePrecision: entity.birthDatePrecision,
    birthPlaceId: entity.birthPlaceId,
    code: entity.code,
    createdAt: entity.createdAt,
    deathDate: entity.deathDate,
    deathDatePrecision: entity.deathDatePrecision,
    displayName: entity.displayName,
    familyName: entity.familyName,
    givenName: entity.givenName,
    id: entity.id,
    isCurrent: entity.isCurrent,
    lifeStatus: entity.lifeStatus,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as PersonPublicDto;
  }

  async execute(input: PersonListQueryDto): Promise<PeopleListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { people: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as PeopleListResponseDto;
  }
}
