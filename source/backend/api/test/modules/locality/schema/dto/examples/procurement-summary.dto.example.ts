import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { procurementItemExample } from "@test/modules/locality/schema/dto/examples/procurement-item.dto.example.ts";

/** The contract shape of ProcurementSummary, for generated tests. */
export const procurementSummaryExample: ContractExample = contractExample({
  name: "ProcurementSummary",
  fields: [
    {
      name: "count",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "currency",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "recent",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => procurementItemExample },
    },
    {
      name: "totalAmount",
      optional: true,
      nullable: true,
      spec: { kind: "number", min: 0 },
    },
  ],
  invariants: [],
});
