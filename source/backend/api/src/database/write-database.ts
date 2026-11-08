import { ServiceUnavailableException } from "@nestjs/common";
import { DataSource } from "typeorm";

import { CommentEntity } from "#/modules/audit/entities/comment.entity";
import { EvidenceReferenceEntity } from "#/modules/audit/entities/evidence-reference.entity";
import { ReviewDecisionEntity } from "#/modules/audit/entities/review-decision.entity";

/**
 * The restricted-writer connection (DATABASE_WRITE_URL). It knows only the three audit entities
 * and its database role has INSERT on those tables and nothing else, so even a bug here cannot
 * touch canonical data. It is created lazily and outside Nest's module graph so the read-only
 * application still boots, and the generated end-to-end specs still run, without it.
 */
let instance: DataSource | undefined;
let starting: Promise<DataSource> | undefined;

export function setWriteDataSource(dataSource: DataSource | undefined): void {
  instance = dataSource;
  starting = undefined;
}

export function writeDataSource(): Promise<DataSource> {
  if (instance?.isInitialized) return Promise.resolve(instance);
  const url = process.env.DATABASE_WRITE_URL;
  if (!url) return Promise.reject(new ServiceUnavailableException("writes are not configured"));
  starting ??= (instance ??= new DataSource({
    type: "postgres",
    url,
    entities: [CommentEntity, EvidenceReferenceEntity, ReviewDecisionEntity],
    synchronize: false,
    migrationsRun: false,
  })).initialize();
  return starting;
}
