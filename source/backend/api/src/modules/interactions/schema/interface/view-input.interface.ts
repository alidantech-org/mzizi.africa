import type { Ref } from "#/modules/interactions/schema/type/ref.type.ts";
import type { Table } from "#/modules/interactions/schema/type/table.type.ts";
import type { Visitor } from "#/modules/interactions/schema/type/visitor.type.ts";

/** View Input */
export interface ViewInput {
  subjectRef: Ref;
  subjectTable: Table;
  visitor: Visitor;
}
