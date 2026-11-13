/** Audit canonical store placement without a second namespace-to-database catalogue. */
import type { SchemaAssignment, StoreAssignments, StoreAudit } from "./contracts.ts";

export function auditStoreAssignments(document: StoreAssignments): StoreAudit {
  const problems: string[] = [];
  const stores = new Set(document.stores);
  if (stores.size !== document.stores.length) problems.push("duplicate store identity");
  const groups = new Map(document.groups.map((group) => [group.name, group]));
  const tables = new Map<string, number>();
  const identities = new Set<string>();
  const resolve = (schema: SchemaAssignment): { store: string | null; namespace: string | null } => {
    let store = schema.storage.store,
      namespace = schema.storage.namespace;
    let current: string | null = schema.group;
    const seen = new Set<string>();
    while (current !== null && (!store || !namespace)) {
      if (seen.has(current)) throw new Error(`group ancestry cycle at ${current}`);
      seen.add(current);
      const group = groups.get(current);
      if (!group) throw new Error(`undefined group ${current}`);
      store ??= group.storage.store;
      namespace ??= group.storage.namespace;
      current = group.parent;
    }
    return { store, namespace };
  };
  for (const schema of document.schemas) {
    if (schema.abstract || schema.role !== "entity") continue;
    const { store, namespace } = resolve(schema);
    if (store === null || !stores.has(store)) {
      problems.push(`${schema.name}: missing or undefined store ${store}`);
      continue;
    }
    if (namespace === null || schema.storage.table === null) {
      problems.push(`${schema.name}: incomplete namespace/table storage identity`);
      continue;
    }
    const identity = `${store}:${namespace}.${schema.storage.table}`;
    if (identities.has(identity)) problems.push(`duplicate table ownership: ${identity}`);
    identities.add(identity);
    tables.set(store, (tables.get(store) ?? 0) + 1);
  }
  return { tables, problems };
}
