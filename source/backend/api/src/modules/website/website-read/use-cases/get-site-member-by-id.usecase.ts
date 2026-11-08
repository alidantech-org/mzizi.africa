import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { SiteMemberPublicDto } from '#/modules/website/dto/site-member-public.dto';
import type { SiteMemberResponseDto } from '#/modules/website/dto/site-member-response.dto';
import type { SiteMemberDto } from '#/modules/website/dto/site-member.dto';
import type { SiteDto } from '#/modules/website/dto/site.dto';
import { SiteMemberEntity } from '#/modules/website/entities/site-member.entity';

/**
 * Get family memberships by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of SiteMemberEntity); review it and add business rules here.
 */
@Injectable()
export class GetSiteMemberByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteMemberEntity);
  }

  private toReadModel(entity: SiteMemberEntity): SiteMemberPublicDto {
    return {
    basis: entity.basis,
    createdAt: entity.createdAt,
    familyId: entity.familyId,
    id: entity.id,
    methodId: entity.methodId,
    role: entity.role,
    score: entity.score,
    siteId: entity.siteId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validTo: entity.validTo,
    version: entity.version,
    } as unknown as SiteMemberPublicDto;
  }

  async execute(input: { siteMemberId: string }): Promise<SiteMemberResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.siteMemberId } as never);
    if (!entity) throw new NotFoundException('SiteMember not found');
    return {
      siteMember: this.toReadModel(entity),
    } as unknown as SiteMemberResponseDto;
  }
}