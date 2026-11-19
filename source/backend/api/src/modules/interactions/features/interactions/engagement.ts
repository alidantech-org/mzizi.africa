/**
 * Likes and views of the web, kept to what USER_INTERACTIONS_AND_TRUST allows it to write. A device actor is made on the
 * first like from a salted hash of an opaque device identifier; a view is one row per visitor per day from a daily-rotating
 * salted hash. Nothing readable about the visitor is stored. Likes are counted from the rows; views are counted and not
 * returned.
 */
import { createHash } from "node:crypto";

import { BadRequestException, NotFoundException } from "@nestjs/common";
import type { DataSource } from "typeorm";

/** The tables a visitor may react to, and nothing else; the subject is looked up in the named table. */
const SUBJECTS = new Set(["civic.projects", "official.individuals", "geography.features", "politics.parties", "governance.institutions"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LIKE = "ref.val.com.reaction.kind.like";

const salt = (): string => process.env.INTERACTION_SALT ?? "development-only-salt";
const sha256 = (text: string): string => createHash("sha256").update(text).digest("hex");

async function subjectId(db: DataSource, table: string, ref: string): Promise<string> {
  if (!SUBJECTS.has(table)) throw new BadRequestException("This kind of record cannot be reacted to.");
  const rows: { id: string }[] = await db.query(
    `select id from ${table} where ${UUID.test(ref) ? "id = $1::uuid" : "(code = $1 or code like '%.' || $1)"} and deleted_at is null limit 1`,
    [ref],
  );
  if (!rows[0]) throw new NotFoundException("No such record.");
  return rows[0].id;
}

async function actorOf(db: DataSource, deviceId: string, create: boolean): Promise<string | null> {
  const hash = sha256(`${salt()}:device:${deviceId}`);
  const found: { actor_id: string }[] = await db.query(
    "select actor_id from community.devices where fingerprint_hash = $1 and platform = 'web' and deleted_at is null limit 1",
    [hash],
  );
  if (found[0]) {
    await db.query("update community.devices set last_seen_at = now(), updated_at = now() where fingerprint_hash = $1 and platform = 'web'", [hash]);
    return found[0].actor_id;
  }
  if (!create) return null;
  const actor: { id: string }[] = await db.query(
    "insert into community.actors (id, kind, status, first_seen_at, last_seen_at, created_at, updated_at, version) values (gen_random_uuid(), 'device', 'active', now(), now(), now(), now(), 1) returning id",
  );
  await db.query(
    "insert into community.devices (id, actor_id, platform, fingerprint_hash, attestation, first_seen_at, last_seen_at, created_at, updated_at, version) values (gen_random_uuid(), $1, 'web', $2, 'none', now(), now(), now(), now(), 1)",
    [actor[0]!.id, hash],
  );
  return actor[0]!.id;
}

async function counts(db: DataSource, subject: string, table: string, actor: string | null) {
  const rows: { likes: string; liked: boolean }[] = await db.query(
    `select count(*)::text as likes, coalesce(bool_or(r.actor_id = $3::uuid), false) as liked
       from community.reactions r join reference.values k on k.id = r.kind_id and k.code = '${LIKE}'
      where r.subject_table = $1 and r.subject_id = $2::uuid and r.deleted_at is null`,
    [table, subject, actor],
  );
  return { likes: Number(rows[0]?.likes ?? 0), liked: rows[0]?.liked ?? false };
}

export async function engagement(db: DataSource, table: string, ref: string, deviceId: string | undefined) {
  const subject = await subjectId(db, table, ref);
  const actor = deviceId ? await actorOf(db, deviceId, false) : null;
  return counts(db, subject, table, actor);
}

export async function like(db: DataSource, table: string, ref: string, deviceId: string) {
  const subject = await subjectId(db, table, ref);
  const actor = (await actorOf(db, deviceId, true))!;
  await db.query(
    `insert into community.reactions (id, actor_id, kind_id, subject_table, subject_id, created_at, updated_at, version)
     select gen_random_uuid(), $1::uuid, k.id, $2, $3::uuid, now(), now(), 1 from reference.values k where k.code = '${LIKE}'
     on conflict (actor_id, kind_id, subject_table, subject_id) do update set deleted_at = null, updated_at = now()`,
    [actor, table, subject],
  );
  return counts(db, subject, table, actor);
}

export async function unlike(db: DataSource, table: string, ref: string, deviceId: string) {
  const subject = await subjectId(db, table, ref);
  const actor = await actorOf(db, deviceId, false);
  if (actor) {
    await db.query(
      `update community.reactions r set deleted_at = now(), updated_at = now() from reference.values k
        where k.id = r.kind_id and k.code = '${LIKE}' and r.actor_id = $1::uuid and r.subject_table = $2 and r.subject_id = $3::uuid and r.deleted_at is null`,
      [actor, table, subject],
    );
  }
  return counts(db, subject, table, actor);
}

export async function recordView(db: DataSource, table: string, ref: string, visitor: string) {
  const subject = await subjectId(db, table, ref);
  const day = new Date().toISOString().slice(0, 10);
  // The hash rotates every day, so a visitor cannot be followed from one day to the next.
  const hash = sha256(`${salt()}:view:${day}:${visitor}`);
  const rows: { id: string }[] = await db.query(
    `insert into community.views (id, subject_table, subject_id, day, visitor_hash, created_at, updated_at, version)
     values (gen_random_uuid(), $1, $2::uuid, $3::date, $4, now(), now(), 1)
     on conflict (subject_table, subject_id, day, visitor_hash) do nothing returning id`,
    [table, subject, day, hash],
  );
  return { recorded: rows.length > 0 };
}
