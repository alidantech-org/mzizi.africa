import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { CommentListQueryDto } from '#/modules/audit/dto/comment-list-query.dto';
import type { CommentPublicDto } from '#/modules/audit/dto/comment-public.dto';
import type { CommentDto } from '#/modules/audit/dto/comment.dto';
import type { CommentsListResponseDto } from '#/modules/audit/dto/comments-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { CommentEntity } from '#/modules/audit/entities/comment.entity';

/**
 * List comments.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of CommentEntity); review it and add business rules here.
 */
@Injectable()
export class FindCommentsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(CommentEntity);
  }

  private toReadModel(entity: CommentEntity): CommentPublicDto {
    return {
    actorId: entity.actorId,
    body: entity.body,
    createdAt: entity.createdAt,
    id: entity.id,
    parentCommentId: entity.parentCommentId,
    targetId: entity.targetId,
    targetKind: entity.targetKind,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as CommentPublicDto;
  }

  async execute(input: CommentListQueryDto): Promise<CommentsListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.targetId !== undefined) where.targetId = input.targetId;
    if (input.targetKind !== undefined) where.targetKind = input.targetKind;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<CommentEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      comments: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as CommentsListResponseDto;
  }
}