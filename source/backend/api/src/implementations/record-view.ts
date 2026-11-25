/** Counts a view once per visitor per day: only a daily-salted hash of the visitor is stored (community.views). */
import { createHash } from "node:crypto";
import { Injectable, Optional } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { DataSource } from "typeorm";
import { RecordedDto } from "#/modules/community/schema/dto/recorded.dto";
import type { ViewInputDto } from "#/modules/community/schema/dto/view-input.dto";

const VIEW_SQL = `
  insert into community.views (id, created_at, day, visitor_hash, identity_id, article_id)
  select gen_random_uuid(), now(), current_date, $1,
         (select id from identity.identities where code = $2 and deleted_at is null),
         (select id from media.articles where code = $2 and deleted_at is null)
  where exists (select 1 from identity.identities where code = $2) or exists (select 1 from media.articles where code = $2)
  on conflict do nothing
  returning id`;

@Injectable()
export class RecordViewUseCase {
  /** Optional so HTTP specs can mock the service; the application registers the DataSource globally. */
  constructor(@Optional() private readonly injected?: DataSource) {}

  private get source(): DataSource {
    if (!this.injected) throw new Error("DataSource must be registered");
    return this.injected;
  }

  async execute({ body: input }: { body: ViewInputDto }): Promise<RecordedDto> {
    const salt = process.env.VIEW_SALT ?? "";
    const day = new Date().toISOString().slice(0, 10);
    const hash = createHash("sha256").update(`${salt}:${day}:${input.visitor}`).digest("hex");
    const rows: unknown[] = await this.source.query(VIEW_SQL, [hash, input.subjectCode]);
    return plainToInstance(RecordedDto, { recorded: rows.length > 0 });
  }
}
