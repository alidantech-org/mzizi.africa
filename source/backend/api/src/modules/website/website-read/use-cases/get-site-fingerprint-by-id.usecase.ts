import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { SiteFingerprintPublicDto } from '#/modules/website/dto/site-fingerprint-public.dto';
import type { SiteFingerprintResponseDto } from '#/modules/website/dto/site-fingerprint-response.dto';
import type { SiteFingerprintDto } from '#/modules/website/dto/site-fingerprint.dto';
import type { SiteDto } from '#/modules/website/dto/site.dto';
import { SiteFingerprintEntity } from '#/modules/website/entities/site-fingerprint.entity';

/**
 * Get site fingerprints by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of SiteFingerprintEntity); review it and add business rules here.
 */
@Injectable()
export class GetSiteFingerprintByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteFingerprintEntity);
  }

  private toReadModel(entity: SiteFingerprintEntity): SiteFingerprintPublicDto {
    return {
    checkId: entity.checkId,
    computedAt: entity.computedAt,
    createdAt: entity.createdAt,
    digest: entity.digest,
    features: entity.features,
    id: entity.id,
    kind: entity.kind,
    siteId: entity.siteId,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as SiteFingerprintPublicDto;
  }

  async execute(input: { siteFingerprintId: string }): Promise<SiteFingerprintResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.siteFingerprintId } as never);
    if (!entity) throw new NotFoundException('SiteFingerprint not found');
    return {
      siteFingerprint: this.toReadModel(entity),
    } as unknown as SiteFingerprintResponseDto;
  }
}