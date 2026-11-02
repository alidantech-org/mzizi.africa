import type { DataSource } from "typeorm";

/**
 * Read helpers over the place tree, occupancy and contact points. Pure SQL over the canonical tables; nothing here
 * writes, and nothing treats an expectation as a place (an expectation holds no address).
 */

export interface ChainPlace {
  id: string;
  kind: string;
  name: string;
  depth: number;
}

/** The place and its ancestors, nearest first (a room, its floor, its structure, its site). */
export async function placeChain(db: DataSource, placeId: string): Promise<ChainPlace[]> {
  return db.query(
    `WITH RECURSIVE up(id, parent_id, kind, name, depth) AS (
       SELECT id, parent_id, kind::text, name, 0 FROM place.places WHERE id = $1
       UNION ALL
       SELECT p.id, p.parent_id, p.kind::text, p.name, up.depth + 1 FROM place.places p JOIN up ON p.id = up.parent_id WHERE up.depth < 32
     ) SELECT id, kind, name, depth FROM up ORDER BY depth`,
    [placeId],
  );
}

export interface Occupant {
  occupancyId: string;
  subjectKind: string;
  subjectId: string;
  placeId: string;
  roleId: string;
}

/** Current occupancies on a place, optionally including its descendants (everything inside a structure). */
export async function occupantsOf(db: DataSource, placeId: string, options: { includeDescendants?: boolean } = {}): Promise<Occupant[]> {
  return db.query(
    `WITH RECURSIVE down(id, depth) AS (
       SELECT id, 0 FROM place.places WHERE id = $1
       UNION ALL
       SELECT p.id, down.depth + 1 FROM place.places p JOIN down ON p.parent_id = down.id WHERE $2::boolean AND down.depth < 32
     ) SELECT o.id AS "occupancyId", o.subject_kind AS "subjectKind", o.subject_id AS "subjectId", o.place_id AS "placeId", o.role_id AS "roleId"
       FROM place.occupancies o JOIN down ON down.id = o.place_id
       WHERE o.is_current AND o.status = 'active' AND o.valid_to IS NULL ORDER BY o.created_at, o.id`,
    [placeId, options.includeDescendants === true],
  );
}

export interface ResolvedContact {
  id: string;
  value: string;
  channel: string;
  /** The scope the contact was found at: the starting scope, an ancestor place, or the occupant. */
  foundAt: { kind: string; id: string };
}

/**
 * The contact for a scope and channel, falling back up the scope chain. For a place the chain is the place, its
 * parent places, then the subject occupying the place (nearest occupancy, the place itself first). Other scopes
 * have no chain and answer only for themselves. Public contacts only unless `visibility` widens it.
 */
export async function resolveContact(
  db: DataSource,
  scope: { kind: string; id: string },
  channel: string,
  options: { visibilities?: string[] } = {},
): Promise<ResolvedContact | undefined> {
  const visibilities = options.visibilities ?? ["public"];
  const at = async (kind: string, id: string): Promise<ResolvedContact | undefined> => {
    const [row] = await db.query(
      `SELECT id, value, channel::text AS channel FROM contact.points
       WHERE scope_kind = $1 AND scope_id = $2 AND channel = $3 AND visibility = ANY($4::contact.points_visibility_enum[]) AND is_current AND valid_to IS NULL
       ORDER BY created_at, id LIMIT 1`,
      [kind, id, channel, visibilities],
    );
    return row && { ...row, foundAt: { kind, id } };
  };
  const own = await at(scope.kind, scope.id);
  if (own || scope.kind !== "place.places") return own;
  const chain = await placeChain(db, scope.id);
  for (const place of chain.slice(1)) {
    const found = await at("place.places", place.id);
    if (found) return found;
  }
  for (const place of chain) {
    const [occupant] = await occupantsOf(db, place.id);
    if (!occupant) continue;
    const found = await at(occupant.subjectKind, occupant.subjectId);
    if (found) return found;
  }
  return undefined;
}
