import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { SiteFamilyPublicDto } from '#/modules/website/dto/site-family-public.dto';
import type { SiteFamilyResponseDto } from '#/modules/website/dto/site-family-response.dto';
import type { SiteFamilyDto } from '#/modules/website/dto/site-family.dto';
import { SiteFamilyEntity } from '#/modules/website/entities/site-family.entity';

/**
 * Get site families by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of SiteFamilyEntity); review it and add business rules here.
 */
@Injectable()
export class GetSiteFamilyByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteFamilyEntity);
  }

  private toReadModel(entity: SiteFamilyEntity): SiteFamilyPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    description: entity.description,
    id: entity.id,
    jurisdictionId: entity.jurisdictionId,
    kind: entity.kind,
    name: entity.name,
    status: entity.status,
    subjectKindId: entity.subjectKindId,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as SiteFamilyPublicDto;
  }

  async execute(input: { familyId: string }): Promise<SiteFamilyResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.familyId } as never);
    if (!entity) throw new NotFoundException('SiteFamily not found');
    return {
      family: this.toReadModel(entity),
    } as unknown as SiteFamilyResponseDto;
  }
}