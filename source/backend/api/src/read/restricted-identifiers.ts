import { Not, In } from "typeorm";
import type { DataSource } from "typeorm";

import { currentActor } from "#/auth/actor-context";
import { satisfies } from "#/auth/roles";

/**
 * Identifier schemes whose values are kept (they are published by the source) but are not served to the public:
 * published telephone numbers, emails and tax numbers. Reviewers and admins (pipeline.read) see them.
 */
export const RESTRICTED_SCHEME_CODES = ["organization/identifier-scheme/kra-pin", "organization/identifier-scheme/contact-phone", "organization/identifier-scheme/contact-email"];

export function mayReadRestricted(): boolean {
  const actor = currentActor();
  return !!actor && satisfies(actor.role, "PipelineReadAccess", actor.permissions);
}

async function restrictedSchemeIds(dataSource: DataSource): Promise<string[]> {
  const rows: { id: string }[] = await dataSource.query(`SELECT id FROM reference.classifications WHERE code = ANY($1)`, [RESTRICTED_SCHEME_CODES]);
  return rows.map((row) => row.id);
}

/** Constraint for list queries: public callers never see restricted schemes. */
export async function identifierConstraints(dataSource: DataSource): Promise<Record<string, unknown>> {
  if (mayReadRestricted()) return {};
  const ids = await restrictedSchemeIds(dataSource);
  return ids.length ? { schemeId: Not(In(ids)) } : {};
}

export async function isHiddenFromCaller(dataSource: DataSource, schemeId: string): Promise<boolean> {
  return !mayReadRestricted() && (await restrictedSchemeIds(dataSource)).includes(schemeId);
}
