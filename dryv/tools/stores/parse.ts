/** Parse compiler JSONL at the boundary; return a named, minimal canonical record projection. */
import type { GroupAssignment, SchemaAssignment, StorageAssignment, StoreAssignments } from "./contracts.ts";

function object(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as Record<string, unknown>;
}
function text(value: unknown, label: string): string {
  if (typeof value !== "string" || !value) throw new Error(`${label} must be nonempty text`);
  return value;
}
function reference(value: unknown, prefix: string): string | null {
  if (value === undefined || value === null) return null;
  const ref = text(object(value, "reference").$ref, "reference.$ref");
  if (!ref.startsWith(prefix)) throw new Error(`expected ${prefix} reference`);
  return ref.slice(prefix.length);
}
function storage(value: unknown): StorageAssignment {
  const facets = value === undefined || value === null ? {} : object(value, "facets");
  const selected = facets.storage === undefined || facets.storage === null ? {} : object(facets.storage, "storage");
  return {
    namespace: selected.namespace === undefined ? null : text(selected.namespace, "storage.namespace"),
    store: reference(selected.store, "#/stores/"),
    table: selected.name === undefined ? null : text(selected.name, "storage.name"),
  };
}
export function parseStoreAssignments(content: string): StoreAssignments {
  const stores: string[] = [],
    groups: GroupAssignment[] = [],
    schemas: SchemaAssignment[] = [];
  for (const line of content.split("\n")) {
    if (!line.trim()) continue;
    const message = object(JSON.parse(line), "compiler frame");
    if (message.type === "error" || (message.type === "diagnostic" && message.severity === "error")) throw new Error(String(message.message));
    if (message.type !== "batch") continue;
    if (!Array.isArray(message.items)) throw new Error("compiler batch items must be an array");
    for (const raw of message.items) {
      const item = object(raw, "canonical record");
      if (item.kind !== "store" && item.kind !== "group" && item.kind !== "schema") continue;
      const name = text(item.name, "canonical name");
      const value = object(item.value, "canonical value");
      if (item.kind === "store") stores.push(name);
      else if (item.kind === "group") groups.push({ name, parent: reference(value.parent, "#/groups/"), storage: storage(value.facets) });
      else {
        if (value.abstract !== undefined && typeof value.abstract !== "boolean") throw new Error("schema abstract must be boolean");
        const group = reference(value.group, "#/groups/");
        if (group === null) throw new Error(`schema ${name} has no group`);
        schemas.push({
          name,
          group,
          abstract: value.abstract === true,
          role: value.role === undefined ? null : text(value.role, "schema.role"),
          storage: storage(value.facets),
        });
      }
    }
  }
  if (!stores.length || !groups.length || !schemas.length) throw new Error("compiled database contracts contain no stores/groups/schemas");
  return { stores, groups, schemas };
}
