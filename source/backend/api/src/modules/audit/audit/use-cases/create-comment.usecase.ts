import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { requireActor } from '#/auth/actor-context';
import { writeDatabase } from '#/database/write-database';
import { assertTarget } from '#/modules/audit/audit/target';
import type { CommentResponseDto } from '#/modules/audit/dto/comment-response.dto';
import type { CreateCommentBodyDto } from '#/modules/audit/dto/create-comment-body.dto';

/**
 * Project-owned. Writes with the restricted-writer connection; the actor comes from the verified
 * token, never the body. Records are append-only: corrections are new records.
 */
@Injectable()
export class CreateCommentUseCase {
  constructor(@InjectDataSource() private readonly readDb: DataSource) {}

  async execute(input: CreateCommentBodyDto): Promise<CommentResponseDto> {
    const actor = requireActor();
    await assertTarget(this.readDb, input.targetKind, input.targetId);
    if (input.parentCommentId) {
      const [parent] = await this.readDb.query(`SELECT target_kind, target_id FROM audit.comments WHERE id = $1`, [input.parentCommentId]);
      if (!parent || parent.target_kind !== input.targetKind || parent.target_id !== input.targetId) {
        throw new BadRequestException('parentCommentId must be a comment on the same record');
      }
    }
    return writeDatabase<CommentResponseDto>("comments", { ...input, actorId: actor.actorId });
  }
}
