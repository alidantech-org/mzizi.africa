import { Pool } from "pg";

import type { VerifiedToken } from "#/auth/token-verifier";

export interface ResolvedAccount {
  accountId: string | null;
  outcome: "ok" | "unknown_identity" | "account_not_active";
}

export interface Decision {
  allowed: boolean;
  reason: string;
  /** For changes: which side failed (existing_owner or proposed_owner). */
  failedOn?: string;
}

/** What the application asks of the access model. Implemented over the `auth` schema; fakeable in tests. */
export interface AccessAuthority {
  resolve(token: VerifiedToken): Promise<ResolvedAccount>;
  /** Platform-wide permission not tied to a record, e.g. pipeline.read or auth.edit. */
  canPlatform(accountId: string, permission: string): Promise<boolean>;
  /** Permission on an existing record of a governed table, e.g. ("electoral.edit", "electoral.results", id). */
  can(accountId: string, permission: string, table: string, recordId: string): Promise<Decision>;
  /** Update that may change the record's owner: the existing and the proposed owner must both allow it. */
  canChange(accountId: string, permission: string, table: string, recordId: string, newLinkId: string): Promise<Decision>;
}

const toDecision = (row: Record<string, unknown>): Decision => ({ allowed: row.allowed === true, reason: String(row.reason), failedOn: row.failed_on as string | undefined });

/** Thin wrapper over auth.resolve_identity, auth.can_platform, auth.can and auth.can_change. */
export class PgAccessAuthority implements AccessAuthority {
  constructor(private readonly pool: Pool) {}

  static fromUrl(url: string): PgAccessAuthority {
    return new PgAccessAuthority(new Pool({ connectionString: url, max: 5 }));
  }

  async resolve(token: VerifiedToken): Promise<ResolvedAccount> {
    const { rows } = await this.pool.query(`SELECT account_id, outcome FROM auth.resolve_identity($1, $2)`, [token.issuer, token.subject]);
    return { accountId: rows[0]?.account_id ?? null, outcome: rows[0]?.outcome ?? "unknown_identity" };
  }

  async canPlatform(accountId: string, permission: string): Promise<boolean> {
    const { rows } = await this.pool.query(`SELECT auth.can_platform($1, $2) AS allowed`, [accountId, permission]);
    return rows[0].allowed === true;
  }

  async can(accountId: string, permission: string, table: string, recordId: string): Promise<Decision> {
    const { rows } = await this.pool.query(`SELECT auth.can($1, $2, $3, $4) AS r`, [accountId, permission, table, recordId]);
    return toDecision(rows[0].r);
  }

  async canChange(accountId: string, permission: string, table: string, recordId: string, newLinkId: string): Promise<Decision> {
    const { rows } = await this.pool.query(`SELECT auth.can_change($1, $2, $3, $4, $5) AS r`, [accountId, permission, table, recordId, newLinkId]);
    return toDecision(rows[0].r);
  }
}
