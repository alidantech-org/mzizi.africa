import { ILike, type FindOptionsWhere, type ObjectLiteral, type Repository } from "typeorm";

/**
 * Shared list behaviour for the read APIs, used by the project-owned Find* use cases.
 *
 * - paging is bounded: page >= 1, 1 <= limit <= 200 (default 20);
 * - equality filters apply for every query parameter that names an entity column;
 * - `q` is a case-insensitive contains match over the entity's text columns;
 * - lists return current records only unless includeHistory is set (superseded versions stay
 *   reachable by id, and the evidence chain is never hidden from detail views);
 * - order is deterministic: code, name, title, label or createdAt, then id.
 */
const CONTROL = new Set(["page", "limit", "sort", "order", "q", "includeHistory"]);
const TEXT_COLUMNS = ["name", "title", "displayName", "officialName", "label", "heading", "citation", "code", "abbreviation", "body"];
const ORDER_COLUMNS = ["code", "name", "title", "label", "createdAt"];

const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 20;

function whole(value: unknown): number | undefined {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
}

function flag(value: unknown): boolean {
  return value === true || value === "true";
}

function escapeLike(text: string): string {
  return text.replace(/[\\%_]/g, (character) => `\\${character}`);
}

/**
 * `constraints` are fixed filters the caller cannot override (for example exposure = public); they
 * apply to every row served, whatever the query says.
 */
export async function listPage<E extends ObjectLiteral>(repository: Repository<E>, input: object, constraints: Record<string, unknown> = {}) {
  const query = input as Record<string, unknown>;
  const page = Math.max(1, whole(query.page) ?? 1);
  const limit = Math.min(Math.max(1, whole(query.limit) ?? DEFAULT_LIMIT), MAX_LIMIT);

  const columns = new Set(repository.metadata.columns.map((column) => column.propertyName));
  const base: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(query)) {
    if (!CONTROL.has(key) && value !== undefined && value !== null && columns.has(key)) base[key] = value;
  }
  if (columns.has("isCurrent") && !flag(query.includeHistory)) base.isCurrent = true;
  Object.assign(base, constraints);

  const text = typeof query.q === "string" && query.q.trim() !== "" ? query.q.trim() : undefined;
  const textColumns = TEXT_COLUMNS.filter((column) => columns.has(column));
  const where = (text && textColumns.length > 0
    ? textColumns.map((column) => ({ ...base, [column]: ILike(`%${escapeLike(text)}%`) }))
    : base) as FindOptionsWhere<E> | FindOptionsWhere<E>[];

  const orderColumn = ORDER_COLUMNS.find((column) => columns.has(column));
  const direction = query.sort === "desc" || query.order === "desc" ? "DESC" : "ASC";
  const order = { ...(orderColumn ? { [orderColumn]: direction } : {}), id: "ASC" } as Record<string, "ASC" | "DESC">;

  const [rows, total] = await repository.findAndCount({ where, order: order as never, skip: (page - 1) * limit, take: limit });
  return { rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}
