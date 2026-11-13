/** Typed projection of the canonical records needed by the store-assignment audit. */
export interface StorageAssignment {
  readonly namespace: string | null;
  readonly store: string | null;
  readonly table: string | null;
}
export interface GroupAssignment {
  readonly name: string;
  readonly parent: string | null;
  readonly storage: StorageAssignment;
}
export interface SchemaAssignment {
  readonly name: string;
  readonly group: string;
  readonly abstract: boolean;
  readonly role: string | null;
  readonly storage: StorageAssignment;
}
export interface StoreAssignments {
  readonly stores: readonly string[];
  readonly groups: readonly GroupAssignment[];
  readonly schemas: readonly SchemaAssignment[];
}
export interface StoreAudit {
  readonly tables: ReadonlyMap<string, number>;
  readonly problems: readonly string[];
}
