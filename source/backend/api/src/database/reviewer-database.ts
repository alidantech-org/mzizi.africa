import { ServiceUnavailableException } from "@nestjs/common";
import { DataSource } from "typeorm";

/**
 * The reviewer connection (DATABASE_REVIEWER_URL): a read-only role granted by the database engine's
 * `grants-reviewer` command on staging, engine, the site registry and the access catalogue. It has no
 * entities (the pipeline views are read models over tables other layers own) and is used only by
 * operations guarded by `pipeline.read`. It never serves public reads and never writes.
 */
let instance: DataSource | undefined;
let starting: Promise<DataSource> | undefined;

export function setReviewerDataSource(dataSource: DataSource | undefined): void {
  instance = dataSource;
  starting = undefined;
}

export function reviewerDataSource(): Promise<DataSource> {
  if (instance?.isInitialized) return Promise.resolve(instance);
  const url = process.env.DATABASE_REVIEWER_URL;
  if (!url) return Promise.reject(new ServiceUnavailableException("the reviewer connection is not configured"));
  starting ??= (instance ??= new DataSource({ type: "postgres", url, entities: [], synchronize: false, migrationsRun: false })).initialize();
  return starting;
}

/** Page and size from a list query, with the limits the admin site relies on. */
export function paging(query: { page?: number; limit?: number }): { page: number; limit: number; offset: number } {
  const limit = Math.min(Math.max(query.limit ?? 50, 1), 200);
  const page = Math.max(query.page ?? 1, 1);
  return { page, limit, offset: (page - 1) * limit };
}

export function pageMeta(page: number, limit: number, total: number) {
  return { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) };
}
